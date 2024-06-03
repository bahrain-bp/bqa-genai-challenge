import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  const uniName = event?.pathParameters?.uniName;
  const standardId = event?.pathParameters?.standardId;
  const indicatorId = event?.pathParameters?.indicatorId;

  // Check if the required parameters are provided
  if (!standardId || !indicatorId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing standardId or indicatorId" }),
    };
  }

  // Define DynamoDB scan parameters
  const params = {
    TableName: Table.FileTable.tableName, // replace with your actual table name
  };

  try {
    // Scan the DynamoDB table
    const result: any = await dynamoDb.scan(params).promise();

    // Filter the items based on standardId and indicatorId in the objectURL
    const filteredItems = result.Items.filter(
      (item: any) =>
        item.fileURL.includes(`/${uniName}/`) &&
        item.fileURL.includes(`/${standardId}/`) &&
        item.fileURL.includes(`/${indicatorId}/`)
    );

    // Check if any items were found
    if (filteredItems.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No content found" }),
      };
    }

    // Return the filtered items
    return {
      statusCode: 200,
      body: JSON.stringify(filteredItems),
    };
  } catch (error) {
    console.error("Error scanning DynamoDB table:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
