import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        // Get the standardId and indicatorId from the query parameters
        const standardId = event?.pathParameters?.id;
        const indicatorId = event?.pathParameters?.indicator;

        if (!standardId || !indicatorId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing standardId or indicatorId in query parameters" }),
            };
        }

        // Define DynamoDB parameters to get the item
        const params = {
            TableName: Table.CriteriaTable.tableName,
            Key: {
                standardId: standardId,
                indicatorId: indicatorId
            }
        };

        // Call DynamoDB to get the item
        const result = await dynamoDb.get(params).promise();

        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Item not found" }),
            };
        }

        // Return success response with the retrieved item
        return {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        };
    } catch (error) {
        // Return error response with status code 500
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
