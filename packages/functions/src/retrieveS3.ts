import { GetObjectOutput } from "aws-sdk/clients/s3";
import * as AWS from 'aws-sdk';

export async function main(): Promise<any> {
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

    const files = data.Contents.map(async (obj: any) => {
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
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error retrieving files" }),
    };
  }
}

function getMetadata(s3: AWS.S3, key: string): Promise<GetObjectOutput["Metadata"] | undefined> {
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
