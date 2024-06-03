import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async (event) => {
    // Get standard ID from path parameters
    const commentId = event?.pathParameters?.id;

    // Define DynamoDB parameters
    const params = {
        TableName: Table.FileTable.tableName,
        Key: {
            commentId: commentId,
        },
    };

    // Call DynamoDB to get the item
    const result = await dynamoDb.get(params).promise();


    // Return the retrieved item
    return {
        statusCode: 200,
        body: JSON.stringify(result.Item),
    };
};