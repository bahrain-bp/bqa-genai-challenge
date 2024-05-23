import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();
const dynamoDbClient = new DynamoDB();

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

async function isIndexReady(
  tableName: string,
  indexName: string
): Promise<boolean> {
  const tableDescription = await dynamoDbClient
    .describeTable({ TableName: tableName })
    .promise();
  const indexes = tableDescription.Table?.GlobalSecondaryIndexes;
  if (!indexes) return false;

  const index = indexes.find((idx) => idx.IndexName === indexName);
  return index?.IndexStatus === "ACTIVE";
}

async function queryWithRetry(
  params: DynamoDB.DocumentClient.QueryInput,
  retries = MAX_RETRIES
): Promise<DynamoDB.DocumentClient.QueryOutput> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await dynamoDb.query(params).promise();
    } catch (error: any) {
      if (
        error.code === "ValidationException" &&
        error.message.includes(
          "Cannot read from backfilling global secondary index"
        )
      ) {
        if (attempt < retries) {
          await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
          continue;
        } else {
          throw new Error("Max retries reached, GSI is still backfilling");
        }
      }
      throw error;
    }
  }
  throw new Error("Unexpected error in queryWithRetry");
}

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const { uniName, standardNumber, indicatorNumber } =
      event.pathParameters || {};

    if (!uniName || !standardNumber || !indicatorNumber) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Missing path parameters. Required: uniName, standardNumber, indicatorNumber",
        }),
      };
    }

    const tableName = Table.ComparisonResult_Table.tableName;
    const indexName = "StandardIndicatorIndex";

    // Check if the index is ready
    const indexReady = await isIndexReady(tableName, indexName);
    if (!indexReady) {
      return {
        statusCode: 503,
        body: JSON.stringify({
          error: "Index is still being created. Please try again later.",
        }),
      };
    }

    const params = {
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression:
        "standardNumber = :standardNumber and indicatorNumber = :indicatorNumber",
      FilterExpression: "uniName = :uniName",
      ExpressionAttributeValues: {
        ":uniName": uniName,
        ":standardNumber": standardNumber,
        ":indicatorNumber": Number(indicatorNumber),
      },
    };

    const result = await queryWithRetry(params);

    if (!result.Items || result.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No matching records found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
