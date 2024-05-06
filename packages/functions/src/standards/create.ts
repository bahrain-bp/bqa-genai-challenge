import * as uuid from "uuid";
import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async (event) => {
    // Parse request body
    const data = JSON.parse(event.body || "{}");

    // Define DynamoDB parameters
    const params = {
        TableName: Table.BQA.tableName,
        Item: {
            entityType: "Standard",
            entityId: uuid.v1(),
            standardId: data.standardId,
            standardName: data.standardName || null,
            indicatorId: data.indicatorId,
            indicatorName: data.indicatorName || null,
            description: data.description || null,
            status: data.status,
            documentName: data.documentName,
            documentURL: data.documentURL
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