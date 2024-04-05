import * as uuid from "uuid";
import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async (event) => {
    // Parse request body
    const data = JSON.parse(event.body);

    // Define DynamoDB parameters
    const params = {
        TableName: Table.BQA.tableName,
        Item: {
            entityType: "Standard",
            entityId: uuid.v1(),
            standardId: uuid.v1(),
            standardName: data.standardName || null,
            description: data.description || null,
        },
    };

    // Call DynamoDB to create the item
    await dynamoDb.put(params).promise();

    // Return success response
    return {
        statusCode: 201,
        body: JSON.stringify(params.Item),
    };
}