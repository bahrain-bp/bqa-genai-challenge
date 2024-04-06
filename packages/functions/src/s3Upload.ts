import * as AWS from "aws-sdk";
import { Queue } from "sst/node/queue";

const s3 = new AWS.S3();
const sqs = new AWS.SQS();

export async function uploadToS3(event: any) {
  try {
    const fileData = event.body; // Binary file data directly available in the event body
    const fileName = event.headers["file-name"]; // Extract file name from headers

    if (!fileName) {
      throw new Error("File name not provided");
    }

    // Define S3 upload parameters
    const params = {
      Bucket: "uni-artifacts",
      Key: fileName,
      Body: fileData,
    };

    // Upload the file to S3
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
      body: JSON.stringify({
        message: "File uploaded successfully",
        location: uploadResult.Location,
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
