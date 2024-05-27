import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

// Define the handler function
export async function main(event: any) {
  try {
    // Extract fileName from the request headers
    const fileName = event?.headers?.['file-name'];

    // Ensure fileName is provided
    if (!fileName) {
      return {
        statusCode: 400, // Bad Request
        body: JSON.stringify({ message: "File name header is required." })
      };
    }

    // Define DynamoDB parameters
    const params = {
      TableName: Table.FileTable.tableName, // Ensure this is the correct table name
      Key: {
        fileName: fileName,
      },
    };

    // Call DynamoDB to get the item
    const result = await dynamoDb.get(params).promise();

    // Check if the item exists
    if (!result.Item) {
      return {
        statusCode: 404, // Not Found
        body: JSON.stringify({ message: "File not found." })
      };
    }

    // Extract the attributes from the retrieved item
    const {
      fileURL,
      standardName,
      standardNumber,
      indicatorNumber,
      name,
      content,
      summary,
      strength,
      weakness,
      score,
      comments,
    } = result.Item;

    // Return the attributes
    return {
      statusCode: 200,
      body: JSON.stringify({
        fileName,
        fileURL,
        standardName,
        standardNumber,
        indicatorNumber,
        name,
        content,
        summary,
        strength,
        weakness,
        score,
        comments,
      }),
    };
  } catch (error:any) {
    // Handle errors
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error retrieving file", error: error.toString() }),
    };
  }
}
