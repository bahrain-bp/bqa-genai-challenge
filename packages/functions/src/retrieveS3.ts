import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from 'aws-sdk';

interface S3ObjectMetadata {
  createdBy?: string; // Optional createdBy property
  creationDate?: string; // Optional creationDate property
}

export async function main(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const s3 = new AWS.S3();

  // Parse the username parameter from the request URL
  const username = event.queryStringParameters?.username;
  console.log("Retrieved Username: " + username);

  const params = {
    Bucket: 'uni-artifacts', 
  };

  try {
    console.log("Listing objects in bucket:", params.Bucket);
    const data = await s3.listObjectsV2(params).promise();

    if (!data.Contents) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "No files found in the bucket" }),
      };
    }

    console.log("Number of objects found:", data.Contents.length);

    const files = data.Contents.map(async (obj) => {
      try {
        const metadata = await getMetadata(s3, obj.Key!);
        return {
          Key: obj.Key,
          Metadata: metadata,
        };
      } catch (error) {
        console.error("Error getting metadata for", obj.Key, error);
        return { Key: obj.Key }; 
      }
    });

    const resolvedFiles = await Promise.allSettled(files);

    const successfulFiles = resolvedFiles.filter((result) => result.status === "fulfilled")
      .map((result) => {
        // Check if the result is fulfilled and has a value
        if (result.status === "fulfilled" && result.value) {
          const { Key, Metadata } = result.value; // Destructure if value exists
            //extract createdBy from metadata
          const createdBy = Metadata && typeof Metadata === 'object' && 'createdby' in Metadata ? Metadata.createdby : undefined;
          
          return {
            Key,
            Metadata: {
              createdBy, 
            }
          };
        } else {
          // Handle unsuccessful results or cases where value is missing
          console.error("Unexpected result:", result); 
          return { Key: undefined, Metadata: {} }; //  empty object 
        }
      });

    // Filter files based on createdBy metadata matching the username
    const filteredFiles = username ?
      successfulFiles.filter(file => {
        const createdBy = file.Metadata?.createdBy || '';
        console.log(`Comparing username '${username}' with createdBy '${createdBy}'`);
        const isMatch = createdBy === username;
        console.log(`Comparison result: ${isMatch}`);
        return isMatch;
      }) :
      successfulFiles;

    console.log("Filtered files:", filteredFiles); 

    const responseBody = {
      statusCode: 200,
      body: JSON.stringify({
        files: filteredFiles,
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

function getMetadata(s3: AWS.S3, key: string): Promise<S3ObjectMetadata | undefined> {
  const params = {
    Bucket: 'uni-artifacts', 
    Key: key,
  };

  return new Promise((resolve, reject) => {
    s3.headObject(params, (err, data) => {
      if (err) {
        console.error("Error getting metadata for", key, err);
        reject(err);
      } else {
        const metadata = data.Metadata;
        console.log("Retrieved metadata for " + key, metadata);
        resolve(metadata);
      }
    });
  });
}