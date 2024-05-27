import { SQSEvent } from "aws-lambda";
import axios, { AxiosResponse } from "axios";
import * as AWS from "aws-sdk";
import { Queue } from "sst/node/queue";

// Variable to store processed message IDs
let processedMessageIds: Set<string> = new Set();
const sqs = new AWS.SQS();
export async function handler(event: SQSEvent, app: any) {
  const records: any[] = event.Records;
  console.log(`Message processed: "${records[0].body}"`);

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

      let endpointUrl: string;
      endpointUrl =
        "https://4qzn87j7l2.execute-api.us-east-1.amazonaws.com/textract";

      const postResponse: AxiosResponse = await axios.post(endpointUrl, {
        bucketName,
        folderName,
        subfolderName,
        fileName,
      });
      const sqsResponse = await sqs
        .sendMessage({
          QueueUrl: Queue["analysis-Queue"].queueUrl,
          MessageBody: "invoked",
          MessageGroupId: "file", // Use fileName as MessageGroupId
          //MessageDeduplicationId: `${fileName}-${Date.now()}`,
        })
        .promise();

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

          //console.log("SQS Response:", sqsResponse);

          // Now this needs to be saved in the database with the corresponding standard name/uni/fileURL
        } catch (error: any) {
          // Log any errors
          console.error("Error sending request:", error.message);

      // Check if the file is a PDF
      if (fileName.endsWith(".pdf")) {
        // Call the splitPdf API to split the PDF into chunks
        const splitPdfResponse: AxiosResponse = await axios.post(
          "https://u1oaj2omi2.execute-api.us-east-1.amazonaws.com/splitPdf",
          null, // pass null as the data parameter
          {
            headers: {
              "Content-Type": "application/json", // set the content type
              "bucket-name": bucketName,
              "file-name": fileName,
              "folder-name": folderName,
              "subfolder-name": subfolderName,
              "subsubfolder-name": subsubfolderName, // Add subsubfolder-name header
            },
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
        // Send message to SQS
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
