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
      const fileName = urlParts[5];

      console.log("Bucket Name:", bucketName);
      console.log("Folder Name:", folderName);
      console.log("Subfolder Name:", subfolderName);
      console.log("File Name:", fileName);

      let endpointUrl: string;

      if (app.stage === "prod") {
        endpointUrl =
          "https://u1oaj2omi2.execute-api.us-east-1.amazonaws.com/textract";
      } else {
        endpointUrl =
          "https://4qzn87j7l2.execute-api.us-east-1.amazonaws.com/textract";
      }

      const postResponse: AxiosResponse = await axios.post(endpointUrl, {
        bucketName,
        folderName,
        subfolderName,
        fileName,
      });

      // Extracted text
      const responseData = postResponse.data;
      const extractedText = responseData.text;
      console.log("Extracted Text from the handler:", extractedText);

      // Construct the request payload to match the provided structure
      const requestBody = {
        body: {
          inputs:
            extractedText +
            "can you provide a summary about this file content, start the summary with This file is about and summarize it in 5 bullet points ",
          parameters: {
            max_new_tokens: 3000,
            top_p: 0.9,
            temperature: 0.2,
          },
        },
      };
      await deleteMessageFromQueue(record.receiptHandle);

      // If the response is successful (status code 200), make a POST request to the SageMaker endpoint
      if (postResponse.status === 200) {
        // Replace "Text" with the actual extracted text
        const endpoint =
          "https://d55gtzdu04.execute-api.us-east-1.amazonaws.com/dev-demo/sageMakerInvoke";

        try {
          // Make the POST request to the endpoint
          const response = await axios.post(endpoint, requestBody);

          // Log the response
          console.log("Response from endpoint:", response.data);
          // Now this needs to be saved in the database with the corresponding standard name/uni/fileURL
        } catch (error: any) {
          // Log any errors
          console.error("Error sending request:", error.message);
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
