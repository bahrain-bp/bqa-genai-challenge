import { GetObjectOutput } from "aws-sdk/clients/s3";
import * as AWS from 'aws-sdk';
interface S3ObjectMetadata {
  createdBy?: string; // Optional createdBy property
  creationDate?: string; // Optional creationDate property
}
export async function main(): Promise<any> {
  const s3 = new AWS.S3();
  
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
        return { Key: obj.Key }; // Example handling, adjust based on needs
      }
    });

    // Wait for all promises to settle (including potential rejections)
    const resolvedFiles = await Promise.allSettled(files);

    const successfulFiles = resolvedFiles.filter((result) => result.status === "fulfilled")
    .map((result) => {
      // Check if the result is fulfilled and has a value (optional Key and Metadata)
      if (result.status === "fulfilled" && result.value) {
        const { Key, Metadata } = result.value; // Destructure if value exists
        return {
          Key,
          // Include all metadata properties from Metadata object
          Metadata
        };
      } else {
        // Handle unsuccessful results or cases where value is missing
        console.error("Unexpected result:", result); // Log for debugging
        return { Key: undefined, Metadata: {} }; // Example empty object for consistency
      }
    });
  



    const failedFiles = resolvedFiles.filter((result) => result.status === "rejected")
      .map((result) => {
        // Handle potential undefined data.Contents
        if (data?.Contents) {
          const failedFile = data.Contents.find(obj => obj.Key === (result as PromiseRejectedResult).reason?.Key); // Type cast to access reason on rejected result
          return failedFile ? { Key: failedFile.Key, Error: (result as PromiseRejectedResult).reason?.message } : undefined;
        } else {
          // Handle case where data.Contents is undefined (e.g., error during listObjectsV2)
          return { Error: "Error listing objects in bucket" }; // Example error message, adjust as needed
        }
      });

    const responseBody = {
      statusCode: 200,
      body: JSON.stringify({
        successfulFiles,
        failedFiles: failedFiles.filter(file => file), // Filter out undefined entries in failedFiles
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
    Bucket: 'uni-artifacts', // Replace with your bucket name
    Key: key,
  };

  return new Promise((resolve, reject) => {
    s3.headObject(params, (err, data) => {
      if (err) {
        console.error("Error getting metadata for", key, err);
        reject(err);
      } else {
        const metadata = data.Metadata;
        // Ensure createdBy exists before returning
        console.log("Retrieved metadata: for "+ key, metadata);
resolve(metadata);
      }
    });
  });
}

