import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async (event: any) => {
    try {
        // Parse request body
        const data = JSON.parse(event.body);

        // Extract item ID from path parameters
        const itemId = event.pathParameters?.fileName;
        if (!itemId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Item ID is missing in path parameters" }),
            };
        }

        // Define DynamoDB parameters
        const params = {
            TableName: Table.FileTable.tableName,
            Key: {
                fileName: itemId,
            },
            UpdateExpression: "set fileURL = :url, standardName = :standardName, standardNumber = :standardNumber, indicatorNumber = :indicatorNumber, #name = :name, content = :content, summary = :summary, strength = :strength, weakness = :weakness, score = :score, comments = :comments",
            ExpressionAttributeValues: {
                ":url": data.fileURL,
                ":standardName": data.standardName,
                ":standardNumber": data.standardNumber,
                ":indicatorNumber": data.indicatorNumber,
                ":name": data.name,
                ":content": data.content,
                ":summary": data.summary,
                ":strength": data.strength,
                ":weakness": data.weakness,
                ":score": data.score,
                ":comments": data.comments
            },
            ExpressionAttributeNames: {
                "#name": "name" // 'name' is a reserved word in DynamoDB, so we need to use ExpressionAttributeNames to specify it
            },
            ReturnValues: "ALL_NEW" // Return the updated item
        };

        // Call DynamoDB to update the item
        const updatedItem = await dynamoDb.update(params).promise();

        // Return success response with updated item
        return {
            statusCode: 200,
            body: JSON.stringify(updatedItem.Attributes),
        };
    } catch (error) {
        console.error("Error updating item:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error" }),
        };
    }
}
