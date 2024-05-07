import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async (event) => {

    // const params = {
    //     TableName: Table.FileSummary.tableName,
    // };

    try {
        // Delete the item from the DynamoDB table
        // await dynamoDb.delete(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Standard deleted successfully" }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error deleting standard", error }),
        };
    }
};