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

    // Define DynamoDB parameters for the update operation
    const params = {
        TableName: Table.UniversityTable.tableName,
        Key: { uniName: uniName },
        UpdateExpression: "set #status = :status",
        ExpressionAttributeNames: {
            "#status": "status",
        },
        ExpressionAttributeValues: {
            ":status": "completed",
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        // Call DynamoDB to update the item
        const result = await dynamoDb.update(params).promise();

        // Return success response
        return {
            statusCode: 200,
            body: JSON.stringify(result.Attributes),
        };
    } catch (error) {
        console.error("Error updating status:", error);
        // Return error response
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error updating status" }),
        };
    }
};
