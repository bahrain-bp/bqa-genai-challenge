
import * as AWS from "aws-sdk";
import { Buffer } from "buffer";
import { Queue } from "sst/node/queue";

const s3 = new AWS.S3();
const sqs = new AWS.SQS();
const axios = require("axios");

async function createFolder(bucketName: string, folderPath: string) {
  try {
    // Check if the folder exists
    const params = {
      Bucket: bucketName,
      Prefix: folderPath,
      Delimiter: "/",
    };
    const data = await s3.listObjectsV2(params).promise();

    // If the folder doesn't exist, create it
    if (!data.CommonPrefixes?.length) {
      const folders = folderPath.split("/");
      let folderKey = "";
      for (const folder of folders) {
        folderKey += folder + "/";
        await s3
          .putObject({
            Bucket: bucketName,
            Key: folderKey,
            Body: "",
          })
          .promise();
      }
    }
  } catch (error) {
    console.error("Error creating folder:", error);
    throw new Error("Failed to create folder");
  }
}

async function generatePresignedUrl(
  bucketName: string, 
  folderPath: string,
  fileName: string, //nfs 
  contentType: string
): Promise<string> {
  try {
    // Generate a pre-signed URL for uploading
    const params = {
      Bucket: bucketName,
      Key: `${folderPath}/${fileName}`, // Combine folder path and file name for Key
      ContentType: contentType, // Use the provided content type
      Expires: 3600, // URL expiration time in seconds (1 hour in this example)
    };

    const signedUrl = await s3.getSignedUrlPromise("putObject", params);
    return signedUrl;
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    throw new Error("Failed to generate pre-signed URL");
  }
}

export async function uploadLogoToS3(event: any) {
  try {
    const fileData = event.body;
    const fileName = event.headers["file-name"]; //logo1.png
    const bucketName = event.headers["bucket-name"];
    const folderName = event.headers["folder-name"];//uni versity
    const subfolderName = event.headers["subfolder-name"];
    const contentType = event.headers["content-type"];

    // Check file size before upload (optional)
    const fileSize = Buffer.byteLength(fileData);
    console.log("File size:", fileSize);

    if (!fileName) {
      throw new Error("File name not provided");
    }

    if (!bucketName) {
      throw new Error("Bucket name not provided");
    }

    if (!folderName) {
      throw new Error("Folder name not provided");
    }

    // Combine folder and subfolder name if subfolder is provided
    const folderPath = subfolderName
      ? `${folderName}/${subfolderName}`
      : folderName;

    // Create folder if it doesn't exist
    await createFolder(bucketName, folderPath);

    // Encode file data to base64
    const fileDataEncoded = Buffer.from(fileData, "base64");

    // Generate pre-signed URL with the provided content type
    const signedUrl = await generatePresignedUrl(
      bucketName,
      folderPath,
      fileName,
      contentType
    );

    try {
      // Upload the file using the pre-signed URL
      const response = await axios.put(signedUrl, fileDataEncoded, {
        headers: {
          "Content-Type": contentType, // Set the appropriate content type
        },
      });
      console.log("Response:", response.data);
      console.log("Response Status:", response.status); // Log response status
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload file");
    }
    const s3ObjectUrl = `https://${bucketName}.s3.amazonaws.com/${folderPath}/${fileName}`;

    console.log("S3 Object URL:", s3ObjectUrl);

    console.log("signedurl", signedUrl);


    

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "File uploaded successfully",
        location: signedUrl,


      }),
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to upload file" }),
    };
  }
}

