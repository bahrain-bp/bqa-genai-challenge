import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();


// Define the handler function
export async function main() {
    try {
        // Define DynamoDB parameters
        // const params = {
        //     TableName: Table.FileSummary.tableName,
        // };

        // Call DynamoDB to query the items
        // const results = await dynamoDb.query(params).promise();

        // Return the matching list of items in response body
        return {
            statusCode: 200,
            // body: JSON.stringify(results.Items),
        };
    } catch (error) {
        // Handle errors
        return {
            statusCode: 500,
            // body: JSON.stringify({ message: "Error querying items", error }),
        };
    }
};