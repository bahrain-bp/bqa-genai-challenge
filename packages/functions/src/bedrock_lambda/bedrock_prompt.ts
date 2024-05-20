import { SQSEvent } from "aws-lambda";
import axios, { AxiosResponse } from "axios";
import * as AWS from "aws-sdk";
import { Queue } from "sst/node/queue";

// Variable to store processed message IDs
let processedMessageIds: Set<string> = new Set();

export async function handler(event: SQSEvent, app: any) {
  try {
    for (const record of event.Records) {
      // Check if the message ID has been processed before
      if (processedMessageIds.has(record.messageId)) {
        console.log(`Duplicate message received: "${record.messageId}"`);
        continue; // Skip processing duplicate messages
      }

      // Add message ID to the set of processed message IDs
      processedMessageIds.add(record.messageId);

      console.log(`Message processed: "${record.body}"`);

      // Extract bucketName, folderName, subfolderName, and fileName from the URL
      const urlParts = record.body.split("/");
      const bucketName = "uni-artifacts";
      const folderName = urlParts[3];
      const subfolderName = urlParts[4];
      const subsubfolderName = urlParts[5];
      const fileName = urlParts[6];

      console.log("Bucket Name:", bucketName);
      console.log("Folder Name:", folderName);
      console.log("Subfolder Name:", subfolderName);
      console.log("Subsubfolder Name:", subsubfolderName);
      console.log("File Name:", fileName);

      // Check if the file is a PDF
      if (fileName.endsWith(".pdf")) {
        // Call the splitPdf API to split the PDF into chunks
        const splitPdfResponse: AxiosResponse = await axios.post(
          "https://u1oaj2omi2.execute-api.us-east-1.amazonaws.com/splitPdf",
          null, // pass null as the data parameter
          {
            headers: {
              'Content-Type': 'application/json', // set the content type
              'bucket-name': bucketName,
              'file-name': fileName,
              'folder-name': folderName,
              'subfolder-name': subfolderName,
            }
          }
        );

        // Get the extracted chunks from the splitPdf response
        const chunks = splitPdfResponse.data.chunks;
        console.log("Extracted chunks from splitPdf:", chunks);

        // Process each chunk (invoke SageMaker in splitPdf)
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          console.log(`Processing chunk ${i + 1}/${chunks.length}: ${chunk}`);
          // Here, splitPdf should handle invoking SageMaker

        }
      }

      // Delete the message from the SQS queue to avoid processing it again
      await deleteMessageFromQueue(record.receiptHandle);
    }

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Messages processed successfully",
      }),
    };
  } catch (error: any) {
    // Log error and return response
    console.log("Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

async function deleteMessageFromQueue(receiptHandle: string): Promise<void> {
  const sqs = new AWS.SQS();
  await sqs
    .deleteMessage({
      QueueUrl: Queue["Document-Queue"].queueUrl,
      ReceiptHandle: receiptHandle,
    })
    .promise();
}
