import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3();

export async function main(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const bucketName = event.headers['bucket-name'];
    const folderName = event.headers['folder-name'];
    const subfolderName = event.headers['subfolder-name'];
    const subsubfolderName =event.headers['subsubfolder-name']

    if (!bucketName || !folderName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Bucket name and folder name are required" }),
      };
    }

    // Combine folder and subfolder name if subfolder is provided

      // Combine folder, subfolder, and sub-subfolder names if provided
      let folderPath = folderName + '/';
      if (subfolderName) {
        folderPath += subfolderName + '/';
      }
      if (subsubfolderName) {
        folderPath += subsubfolderName + '/';
      }
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


      console.log("Files to be returned:", JSON.stringify(files));

      const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", // Adjust in production
            "Access-Control-Allow-Methods": "GET, HEAD, PUT, POST,DELETE",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({files}),
    };      
    return response;
    

  } catch (error) {
    console.error("Error retrieving files:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error retrieving files", error}),
    };
  }
}