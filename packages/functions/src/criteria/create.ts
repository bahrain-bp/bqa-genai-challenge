import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        // Parse request body
        const data = JSON.parse(event.body);

        // Check if the payload contains necessary fields
        if (!data.standardId || !data.standardName || !data.indicators) {
            throw new Error("Invalid request payload. Required fields are missing.");
        }

        // Define DynamoDB parameters for standards
        const standardParams = {
            TableName: Table.CriteriaTable.tableName,
            Item: {
                standardId: data.standardId,
                standardName: data.standardName,
                indicators: data.indicators.map((indicator: { indicatorId: any; indicatorName: any; comments: any[]; }) => ({
                    indicatorId: indicator.indicatorId,
                    indicatorName: indicator.indicatorName,
                    comments: indicator.comments.map(comment => ({
                        commentId: comment.commentId,
                        comment: comment.comment
                    }))
                }))
            },
        };

        // Call DynamoDB to create the standard
        await dynamoDb.put(standardParams).promise();

        // Return success response
        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Standards, indicators, and comments created successfully." }),
        };
    } catch (error) {
        // Return error response with status code 400
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
