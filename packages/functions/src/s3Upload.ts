<<<<<<< HEAD
import * as AWS from "aws-sdk";
import { Queue } from "sst/node/queue";

=======
import * as AWS from 'aws-sdk';
>>>>>>> 1237f99d8798e7b36d97f6686e90d30842d25f6c
const s3 = new AWS.S3();
const sqs = new AWS.SQS();

export async function uploadToS3(event: any) {
  try {
<<<<<<< HEAD
    const fileData = event.body; // Binary file data directly available in the event body
    const fileName = event.headers["file-name"]; // Extract file name from headers
=======
    const fileData = event.body; // Binary file data
    const fileName = event.headers['file-name']; // Get file name
>>>>>>> 1237f99d8798e7b36d97f6686e90d30842d25f6c

    if (!fileName) {
      throw new Error("File name not provided");
    }

// Get current user session
    // Define metadata for the object
    const metadata = {
      "createdBy": "Amjad",
      "creationDate": new Date().toISOString()
    };

    // Define S3 upload parameters, including metadata
    const params = {
      Bucket: "uni-artifacts",
      Key: fileName,
      Body: fileData,
      ObjectMetadata: metadata
    };

    // Upload the file with metadata
    const uploadResult = await s3.upload(params).promise();

    //send the file to the queue
    // Send a message to queue
    await sqs
      .sendMessage({
        // Get the queue url from the environment variable
        QueueUrl: Queue["Document-Queue"].queueUrl,
        MessageBody: uploadResult.Location,
        MessageGroupId: "file", // Use fileName as MessageGroupId
        MessageDeduplicationId: `${fileName}-${Date.now()}`,
      })
      .promise();

    console.log("Message queued!");

    return {
      statusCode: 200,
<<<<<<< HEAD
      body: JSON.stringify({
        message: "File uploaded successfully",
        location: uploadResult.Location,
      }),
=======
      body: JSON.stringify({ message: 'File uploaded successfully', location: uploadResult.Location, metadata: metadata }),
>>>>>>> 1237f99d8798e7b36d97f6686e90d30842d25f6c
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to upload file" }),
    };
  }
}
