import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async (event) => {
    // Get standard ID from path parameters
    const standardId = event?.pathParameters?.id;

    // Define DynamoDB parameters
    const params = {
        TableName: Table.BQA.tableName,
        Key: {
            standardId: standardId,
        },
    };

    // Call DynamoDB to get the item
    const result = await dynamoDb.get(params).promise();

    // // Check if the item exists
    // if (!result.Item) {
    //     // throw new Error("Standard not found.");
    // }

    // Return the retrieved item
    return {
        statusCode: 200,
        body: JSON.stringify(result.Item),
    };
};