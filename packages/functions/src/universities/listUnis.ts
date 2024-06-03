import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async () => {
    // Define DynamoDB parameters
    const params = {
        TableName: Table.UniversityTable.tableName,
    };

    try {
        // Scan the table to get all items
        const result = await dynamoDb.scan(params).promise();

        // Return success response with the list of universities
        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };
    } catch (error) {
        console.error("Error listing universities:", error);

        // Return error response
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error listing universities" }),
        };
    }
};
