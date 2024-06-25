import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async () => {
    try {
        // Define DynamoDB parameters to scan the table
        const params = {
            TableName: Table.videoCriteriaTable.tableName,
        };

        // Call DynamoDB to scan the table
        const result = await dynamoDb.scan(params).promise();

        // Return success response with the retrieved items
        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };
    } catch (error) {
        // Return error response with status code 500
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error}),
        };
    }
};
