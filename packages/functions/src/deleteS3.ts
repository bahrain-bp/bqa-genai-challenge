import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3();

export async function main(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const { bucketName, key } = JSON.parse(event.body);

    if (!bucketName || !key) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Bucket name and file key are required" }),
      };
    }

    // Delete the object
    const params = {
      Bucket: bucketName,
      Key: key
    };

    await s3.deleteObject(params).promise();

    console.log(`File deleted: ${key}`);

    return {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Origin": "*", // Adjust in production
          "Access-Control-Allow-Methods": "GET, HEAD, PUT, POST, DELETE",
          "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({ message: "File successfully deleted" }),
    };

  } catch (error) {
    console.error("Error deleting file:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to delete file", error: error.message }),
    };
  }
}
