import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 200;

async function queryWithBackoff(params, retries = 0): Promise<DynamoDB.DocumentClient.QueryOutput> {
    try {
        return await dynamoDb.query(params).promise();
    } catch (error) {
        if (error.code === 'ValidationException' && error.message.includes('backfilling global secondary index')) {
            if (retries < MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, BASE_DELAY_MS * Math.pow(2, retries)));
                return queryWithBackoff(params, retries + 1);
            } else {
                throw new Error(`Reached maximum retries (${MAX_RETRIES}) for querying the GSI.`);
            }
        } else {
            throw error;
        }
    }
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        // Parse request body
        const data = JSON.parse(event.body || '{}');

        // Check if the payload contains necessary fields
        if (!data.standardId || !data.indicatorId) {
            throw new Error("Invalid request payload. Required fields are missing.");
        }

        const { standardId, indicatorId } = data;

        // Define DynamoDB query parameters
        const params = {
            TableName: Table.videoCriteriaTable.tableName,
            IndexName: "StandardIndicatorIndex",
            KeyConditionExpression: "standardId = :standardId and indicatorId = :indicatorId",
            ExpressionAttributeValues: {
                ":standardId": standardId,
                ":indicatorId": indicatorId
            }
        };

        // Query DynamoDB with backoff
        const result = await queryWithBackoff(params);

        // Extract criteria from the query result
        const criteriaList = result.Items?.map(item => item.criteria) || [];

        // Generate the prompt string
        const prompt = criteriaList.length > 0
            ? `Check if the video contains these elements individually: ${criteriaList.join(" .And ")}. Then give comments on all elements. Expected Response sample {Yes, No, Yes, Video doesn't qualify in element one because ... it doesn't qualify for element two because....} stick to only yes or no and comments.`
            : "No criteria found for the given standard and indicator.";
        console.log(prompt);
        // Return success response with the generated prompt
        return {
            statusCode: 200,
            body: JSON.stringify({ prompt }),
        };
    } catch (error) {
        // Return error response with status code 400
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error }),
        };
    }
};
