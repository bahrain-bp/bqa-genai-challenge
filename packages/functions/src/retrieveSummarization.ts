import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

// Define the handler function
export async function main(event: any) {
    try {
        // Extract fileName from the request path parameters
        const fileName = event?.pathParameters?.fileName;

        // Ensure fileName is provided
        if (!fileName) {
            throw new Error("File name is required.");
        }

        // Define DynamoDB parameters
        const params = {
            TableName: Table.BQA.tableName,
            Key: {
                fileName: fileName,
            },
        };

        // Call DynamoDB to get the item
        const result = await dynamoDb.get(params).promise();

        // Check if the item exists
        if (!result.Item) {
            throw new Error("File not found.");
        }

        // Extract the text and summarization from the retrieved item
        const { comparison, summarization } = result.Item;

        // Return the text and summarization
        return {
            statusCode: 200,
            body: JSON.stringify({ fileName, comparison, summarization }),
        };
    } catch (error) {
        // Handle errors
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error retrieving file", error: error }),
        };
    }
};
