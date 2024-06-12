import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";
import { v4 as uuidv4 } from 'uuid'; // Import UUID package

const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        // Parse request body
        const data = JSON.parse(event.body || '{}');

        // Check if the payload contains necessary fields
        if (!data.standardId || !data.indicatorId || !data.criteria) {
            throw new Error("Invalid request payload. Required fields are missing.");
        }

        // Generate a unique ID
        const id = uuidv4();

        // Define DynamoDB parameters for videoCriteria
        const params = {
            TableName: Table.videoCriteriaTable.tableName,
            Item: {
                id, // Use generated UUID
                standardId: data.standardId,
                indicatorId: data.indicatorId,
                criteria: data.criteria
            },
        };

        // Call DynamoDB to create the item
        await dynamoDb.put(params).promise();

        // Return success response
        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Video criteria created successfully." }),
        };
    } catch (error) {
        // Return error response with status code 400
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error }),
        };
    }
};
