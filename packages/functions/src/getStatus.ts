import { APIGatewayProxyEvent, Context, Handler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import * as winston from "winston";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [new winston.transports.Console()],
});

const getStatusByFileNameHandler: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
    const fileName = event.pathParameters?.fileName;

    if (!fileName) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "fileName is required" }),
        };
    }

    const params = {
        TableName: Table.statusTable.tableName,
        // IndexName: "fileName-index", // Assuming a secondary index on fileName

        KeyConditionExpression: "#processName = :processName",
        FilterExpression: "#fileName = :fileName",
        ExpressionAttributeNames: {
            "#processName": "processName",
            "#fileName": "fileName"
        },
        ExpressionAttributeValues: {
            ":processName": "File Processing",
            ":fileName": fileName
        }
    };


    try {
        const result = await dynamoDb.query(params).promise();
        if (!result.Items || result.Items.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Process not found" }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };
    } catch (error) {
        logger.error(`Failed to fetch status for fileName ${fileName}: ${(error as Error).message}`);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch status" }),
        };
    }
};

const getStatusByUniStandardIndicatorHandler: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
    const combinedKey = event.headers["combined-key"];

    if (!combinedKey) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "combined-key header is required" }),
        };
    }

    const params = {
        TableName: Table.statusTable.tableName,
        FilterExpression: "combinedKey = :combinedKey AND processName = :processName", // Specify the condition for filtering items
        ExpressionAttributeValues: {
            ":combinedKey": combinedKey,
            ":processName": "Comparing Process",
        }
    };

    try {
        const result = await dynamoDb.scan(params).promise(); // Use scan instead of query for non-primary key conditions
        if (!result.Items || result.Items.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Process not found" }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };
    } catch (error) {
        logger.error(`Failed to fetch status: ${(error as Error).message}`);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch status" }),
        };
    }
};
export { getStatusByFileNameHandler, getStatusByUniStandardIndicatorHandler };
