import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async (event) => {
    const data = JSON.parse(event.body);
    const standardId = event.pathParameters?.id;

    const params = {
        TableName: Table.BQA.tableName,
        Key: {
            entityType: "Standard",
            entityId: standardId,
        },
        UpdateExpression: "SET #standardName = :standardName, #description = :description, #status = :status",
        ExpressionAttributeNames: {
            "#standardName": "standardName",
            "#description": "description",
            "#status": "status",
        },
        ExpressionAttributeValues: {
            ":standardName": data.standardName || null,
            ":description": data.description || null,
            ":status":  data.status || null,
        },
        ReturnValues: "ALL_NEW",
    };

    try {
        const result = await dynamoDb.update(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(result.Attributes),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error updating standard", error }),
        };
    }
};