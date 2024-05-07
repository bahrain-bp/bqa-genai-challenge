import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async (event) => {

    // Define DynamoDB parameters
    // const params = {
    //     TableName: Table.FileSummary.tableName,
    // };

    // Call DynamoDB to get the item
    // const result = await dynamoDb.get(params).promise();

    // // Check if the item exists
    // if (!result.Item) {
    //     // throw new Error("There is no Summary for this file.");
    // }

    // Return the retrieved item
    return {
        statusCode: 200,
        // body: JSON.stringify(result.Item),
    };
};