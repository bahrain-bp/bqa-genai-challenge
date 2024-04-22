import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();


// Define the handler function
export async function main() {
    try {
        // Define DynamoDB parameters
        const params = {
            TableName: Table.BQA.tableName,
            // 'KeyConditionExpression' defines the condition for the query
            // - 'entityType = :entityType': only return items with matching 'entityType'
            //   partition key
            KeyConditionExpression: "#entityType = :entityType",
            // 'ExpressionAttributeNames' defines the name substitution in the condition
            // - '#entityType': defines 'entityType' as the partition key
            ExpressionAttributeNames: {
                "#entityType": "entityType",
            },
            // 'ExpressionAttributeValues' defines the value in the condition
            // - ':entityType': defines 'entityType' to be the type of the entity (e.g., "Standard")
            ExpressionAttributeValues: {
                ":entityType": "Standard",
            },
        };

        // Call DynamoDB to query the items
        const results = await dynamoDb.query(params).promise();

        // Return the matching list of items in response body
        return {
            statusCode: 200,
            body: JSON.stringify(results.Items),
        };
    } catch (error) {
        // Handle errors
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error querying items", error }),
        };
    }
};