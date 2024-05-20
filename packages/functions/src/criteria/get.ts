import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        // Get the standardId from the path parameters
        const standardId = event?.pathParameters?.id;

        if (!standardId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing standardId in path parameters" }),
            };
        }

        // Define DynamoDB parameters to get the standard
        const params = {
            TableName: Table.CriteriaTable.tableName,
            Key: {
                standardId: standardId
            }
        };

        // Call DynamoDB to get the item
        const result = await dynamoDb.get(params).promise();

        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Standard not found" }),
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
