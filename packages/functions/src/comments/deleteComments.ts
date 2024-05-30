import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async (event) => {
    const commentId = event.pathParameters?.id;

    const params = {
        TableName: Table.FileTable.tableName,
        Key: {
            commentId: commentId,
        },
    };

    try {
        // Delete the item from the DynamoDB table
        await dynamoDb.delete(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "comment deleted successfully" }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error deleting comment", error }),
        };
    }
};