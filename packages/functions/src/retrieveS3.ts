import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3();

export async function main(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const bucketName = event.headers['bucket-name'];
    const folderName = event.headers['folder-name'];
    const subfolderName = event.headers['subfolder-name'];

    if (!bucketName || !folderName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Bucket name and folder name are required" }),
      };
    }

    // Combine folder and subfolder name if subfolder is provided
    const folderPath = subfolderName ? `${folderName}/${subfolderName}/` : `${folderName}/`;

    // Get list of objects in the specified folder
    const params = {
      Bucket: bucketName,
      Prefix: folderPath,
    };

    const data = await s3.listObjectsV2(params).promise();

    if (!data.Contents) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "No files found in the specified folder" }),
      };
    }

    const files = data.Contents
      .filter(obj => obj.Key && !obj.Key.endsWith("/")) // Filter out directory (prefix) objects
      .map((obj) => {
        return {
          Key: obj.Key!,
        };
      });

    const responseBody = {
      statusCode: 200,
      body: JSON.stringify({
        files,
      }),
    };

    return responseBody;
  } catch (error) {
    console.error("Error retrieving files:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error retrieving files" }),
    };
  }
}