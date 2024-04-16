import { GetObjectOutput } from "aws-sdk/clients/s3";
import * as AWS from 'aws-sdk';

// Define an interface for the Metadata object
interface S3ObjectMetadata {
  createdBy?: string; // Optional createdBy property
}

export async function main(event: any): Promise<any> {
  const username = event.queryStringParameters?.username; // Get username from URL parameter

  const s3 = new AWS.S3();

  const params = {
    Bucket: 'uni-artifacts', // Replace with your bucket name
  };

  try {
    const data = await s3.listObjectsV2(params).promise();

    if (!data.Contents) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "No files found in the bucket" }),
      };
    }

    // Filter objects with matching createdBy asynchronously (using Promise.all)
    const filteredPromises = data.Contents.map(async (obj: any) => {
      try {
        const metadata = await getMetadata(s3, obj.Key!);
        return metadata?.createdBy === username ? obj : undefined;
      } catch (error) {
        console.error("Error filtering object:", obj.Key, error);
        return undefined; // Handle error, potentially return a default value
      }
    });

    // Wait for all filtering promises to resolve
    const filteredFiles = await Promise.all(filteredPromises);

    // Remove any undefined elements from filteredFiles (optional)
    const finalFiles = filteredFiles.filter((file) => file !== undefined);

    const files = finalFiles.map(async (obj: any) => {
      return {
        Key: obj.Key, // Include the filename (Key property)
        Metadata: await getMetadata(s3, obj.Key!),
      };
    });

    // Wait for all metadata retrieval promises to resolve
    const resolvedFiles = await Promise.all(files);

    return {
      statusCode: 200,
      body: JSON.stringify({ files: resolvedFiles }),
    };
  } catch (error) {
    console.error("Error retrieving files:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
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
        resolve(data.Metadata);
      }
    });
  });
}
