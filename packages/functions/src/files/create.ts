import * as uuid from "uuid";
import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async (event: any) => {
    try {
        // Parse request body
        const data = JSON.parse(event.body);

        // Generate a unique ID for the new item
        const fileId = uuid.v4();

        // Define DynamoDB parameters
        const params = {
            TableName: Table.FileTable.tableName,
            Item: {
                fileId: fileId,
                fileName: data.fileName,
                fileURL: data.fileURL,
                standardName: data.standardName,
                standardNumber: data.standardNumber,
                indicatorNumber: data.indicatorNumber,
                name: data.name,
                content: data.content,
                summary: data.summary,
                strength: data.strength,
                weakness: data.weakness,
                score: data.score,
                comments: data.comments
            },
        };

        // Call DynamoDB to create the item
        await dynamoDb.put(params).promise();

        // Return success response
        return {
            statusCode: 201,
            body: JSON.stringify({ fileId: fileId }),
        };
    } catch (error) {
        console.error("Error creating item:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error" }),
        };
    }
}
