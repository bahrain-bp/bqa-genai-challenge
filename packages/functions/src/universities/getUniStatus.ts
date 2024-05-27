import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async (event) => {
        // Check if pathParameters and uniName are defined
        if (!event.pathParameters || !event.pathParameters.uniName) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Missing uniName path parameter" }),
            };
        }
    
        // Extract uniName from the path parameters
        const { uniName } = event.pathParameters;

    // Define DynamoDB parameters for the query operation
    const params = {
        TableName: Table.UniversityTable.tableName,
        Key: { uniName: uniName }
    };

    try {
        // Call DynamoDB to get the item
        const result = await dynamoDb.get(params).promise();

        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "University not found" }),
            };
        }

        // Return success response with the university item
        return {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        };
    } catch (error) {
        console.error("Error fetching university status:", error);
        // Return error response
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error fetching university status" }),
        };
    }
};
