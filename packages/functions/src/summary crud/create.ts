import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";

// Create a new instance of the DynamoDB client
const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async (event) => {
    // Parse request body
    const data = JSON.parse(event.body || ""); // /fix Argument of type 'string | undefined' is not assignable to parameter of type 'string'. Type 'undefined' is not assignable to type 'string'.
    // To fix the issue, you need to check if event.body is defined before parsing it as JSON. If it is undefined, you can assign an empty string to data instead.

    // Define DynamoDB parameters
    // const params = {
    //     TableName: Table.FileSummary.tableName,
    //     Item: {
    //         standardName: data.standardName || null,
    //         indicatorName: data.indicatorName || null,
    //         fileUrl: data.fileUrl,
    //         fileName: data.fileName,
    //         summaryResults: data.summaryResults  // Attribute to store summary results from Jumpstar AI model
    //     },
    // };

    // Call DynamoDB to create the item
    // await dynamoDb.put(params).promise();

    // Return success response 
    return {
        statusCode: 201,
        // body: JSON.stringify(params.Item),
    };
}