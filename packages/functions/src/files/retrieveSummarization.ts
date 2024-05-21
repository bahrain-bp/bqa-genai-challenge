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
            TableName: Table.FileTable.tableName, // Updated to use the correct table
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

        // Extract the attributes from the retrieved item
        const { fileURL, standardName, standardNumber, indicatorNumber, name, content, summary, strength, weakness, score, comments } = result.Item;

        // Return the attributes
        return {
            statusCode: 200,
            body: JSON.stringify({ summary}),
        };
    } catch (error) {
        // Handle errors
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error retrieving file", error: error }),
        };
    }
}
