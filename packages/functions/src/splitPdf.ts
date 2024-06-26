import * as AWS from "aws-sdk";
import { PDFDocument, PDFPage } from "pdf-lib";
const axios = require("axios");
import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
import { randomUUID } from "crypto";
import { Queue } from "sst/node/queue";

const s3 = new AWS.S3();
const sqs = new AWS.SQS();
const maxTokens = 500; // Adjust based on your SageMaker token limit
const maxAllowedTokens = 4096; // Maximum tokens allowed by SageMaker endpoint

// Create an instance of DynamoDB DocumentClient
const dynamoDb = new DynamoDB.DocumentClient();

const updateProcessStatus = async (
  status: string,
  processName: string,
  fileName: string // Only fileName as the unique identifier
) => {
  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: Table.statusTable.tableName,
    Item: {
      status,
      processName,
      fileName, // Use fileName as the unique identifier
      timestamp: new Date().toISOString(), // Optional: Add a timestamp
    },
  };

  try {
    await dynamoDb.put(params).promise();
    console.log(`Inserted/Updated status to ${status} `);
  } catch (error) {
    console.error(
      `Failed to insert/update status  ${(error as Error).message}`
    );
  }
};

async function getOldestMessage(queueUrl: string): Promise<AWS.SQS.Message | null> {
  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 10, // Adjust the number as needed
    VisibilityTimeout: 30,   // Adjust the visibility timeout as needed
    WaitTimeSeconds: 0       // Short polling
  };

  const result = await sqs.receiveMessage(params).promise();
  const messages = result.Messages;

  if (!messages || messages.length === 0) {
    return null; // No messages in the queue
  }

  // Find the oldest message based on the 'SentTimestamp' attribute
  let oldestMessage: AWS.SQS.Message = messages[0];
  for (const message of messages) {
    const sentTimestamp = parseInt(message.Attributes?.SentTimestamp || '0', 10);
    const oldestSentTimestamp = parseInt(oldestMessage.Attributes?.SentTimestamp || '0', 10);

    if (sentTimestamp < oldestSentTimestamp) {
      oldestMessage = message;
    }
  }

  return oldestMessage;
}

async function deleteMessageFromQueue(receiptHandle: string): Promise<void> {
  await sqs.deleteMessage({
    QueueUrl: Queue["Document-Queue"].queueUrl,
    ReceiptHandle: receiptHandle
  }).promise();
}

async function deleteOldestMessage(queueUrl: string): Promise<void> {
  const oldestMessage = await getOldestMessage(queueUrl);

  if (!oldestMessage) {
    console.log('No messages to delete');
    return;
  }

  console.log('Deleting message:', oldestMessage.MessageId);
  await deleteMessageFromQueue(oldestMessage.ReceiptHandle as string);
}

export const handler = async (event: any) => {
  try {
    // Extract parameters from event headers with meaningful names
    const bucketName = event.headers["bucket-name"];
    const key = event.headers["file-name"] || "unnamed.pdf"; // Default filename if absent
    const folderName = event.headers["folder-name"] || "";
    const subfolderName = event.headers["subfolder-name"] || "";
    const subsubfolderName = event.headers["subsubfolder-name"] || "";

    // Validate required parameters
    if (!bucketName || !key) {
      throw new Error("Missing required parameters: Bucket and file key");
    }

    // Construct S3 object key with optional folder/subfolder structure
    const objectKey = `${folderName ? folderName + "/" : ""}${subfolderName ? subfolderName + "/" : ""}${subsubfolderName ? subsubfolderName + "/" : ""}${key}`;

    // Download the PDF file from S3
    const response = await s3
      .getObject({ Bucket: bucketName, Key: objectKey })
      .promise();

    // Check if Body exists in the response
    if (!response.Body) {
      throw new Error("Failed to retrieve PDF file from S3");
    }

    // Convert Body to ArrayBuffer
    let arrayBuffer: ArrayBuffer;

    // Handle different types of Body
    if (typeof response.Body === "string") {
      // Body is a string, convert it to Uint8Array first
      const uint8Array = new TextEncoder().encode(response.Body);
      // Then convert Uint8Array to ArrayBuffer
      arrayBuffer = uint8Array.buffer;
    } else if (response.Body instanceof Uint8Array) {
      // Body is already a Uint8Array
      arrayBuffer = response.Body.buffer;
    } else if (response.Body instanceof Blob) {
      // Body is a Blob, convert it to ArrayBuffer
      arrayBuffer = await response.Body.arrayBuffer();
    } else {
      throw new Error("Unsupported type of Body");
    }

    // Load PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // Split the PDF into smaller documents
    const totalPages = pdfDoc.getPages().length;
    const splitSize = 2; // Adjust split size as needed

    // Process chunks sequentially
    const { extractedTexts, extractedSummaries } = await processChunks(
      pdfDoc,
      totalPages,
      splitSize,
      bucketName,
      folderName,
      subfolderName,
      subsubfolderName,
      objectKey
    );

    // Prepare data for DynamoDB
    const fileName = objectKey;
    const fileURL = `https://${bucketName}.s3.amazonaws.com/${objectKey}`;
    const standardName = ""; // Extracted or assigned as needed
    const indicatorName = ""; // Extracted or assigned as needed
    const standardNumber = 0; // Extracted or assigned as needed
    const indicatorNumber = 0; // Extracted or assigned as needed
    const name = ""; // Extracted or assigned as needed
    const content = extractedTexts.join(" "); // Join all extracted texts
    const summary = extractedSummaries.join(" "); // Generated summary as needed
    const strength = ""; // Extracted or assigned as needed
    const weakness = ""; // Extracted or assigned as needed
    const score = 0; // Extracted or assigned as needed
    const comments = ""; // Extracted or assigned as needed

   
    // Insert data into DynamoDB using /createFileDb API
    await axios.post(
      "https://u1oaj2omi2.execute-api.us-east-1.amazonaws.com/createFileDB",
      {
        fileName,
        fileURL,
        standardName,
        indicatorName,
        standardNumber,
        indicatorNumber,
        name,
        content,
        summary,
        strength,
        weakness,
        score,
        comments,
      }
    );
     // Delete the oldest message in the queue
     await deleteOldestMessage(Queue["Document-Queue"].queueUrl);


    try {
      await updateProcessStatus("Completed", "File Processing", fileName);
      console.log("Saved in DB");
    } catch (error) {
      console.log("Error saving status", error);
    }

    // Return the extracted text chunks as response
    return {
      statusCode: 200,
      body: JSON.stringify({ chunks: extractedSummaries }),
    };
  } catch (error) {
    console.log("Error during processing:", error);
    // Return error response
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error processing request" }),
    };
  }
};

async function processChunks(
  pdfDoc: PDFDocument,
  totalPages: number,
  splitSize: number,
  bucketName: string,
  folderName: string,
  subfolderName: string,
  subsubfolderName: string,
  objectKey: string,
  currentIndex: number = 0,
  extractedTexts: string[] = [],
  extractedSummaries: string[] = []
): Promise<{ extractedTexts: string[]; extractedSummaries: string[] }> {
  if (currentIndex >= totalPages) {
    // All chunks processed, return the extracted texts and summaries
    return { extractedTexts, extractedSummaries };
  }

  const endPage = Math.min(currentIndex + splitSize, totalPages);

  // Copy pages
  const copiedPagesPromise = pdfDoc.copyPages(
    pdfDoc,
    Array.from(
      { length: endPage - currentIndex },
      (_, index) => index + currentIndex
    )
  );
  const copiedPages: PDFPage[] = await copiedPagesPromise;

  // Create a new PDF document for the split
  const splitDoc = await PDFDocument.create();

  // Add copied pages to the new document
  for (const copiedPage of copiedPages) {
    const clonedPage = await splitDoc.embedPage(copiedPage);
    const newPage = splitDoc.addPage([
      copiedPage.getWidth(),
      copiedPage.getHeight(),
    ]);
    newPage.drawPage(clonedPage);
  }

  // Save the split PDF into a buffer
  const splitPDFBytes = await splitDoc.save();

  // Upload the split PDF file to the same S3 bucket and key
  await s3
    .putObject({
      Bucket: bucketName,
      Key: `${objectKey}-split-${currentIndex + 1}.pdf`,
      Body: splitPDFBytes,
      ContentType: "application/pdf", // Set the content type accordingly
    })
    .promise();

  const textractRequest = {
    bucketName: bucketName,
    folderName: folderName,
    subfolderName: subfolderName,
    subsubfolderName: subsubfolderName,
    fullKey: `${objectKey}-split-${currentIndex + 1}.pdf`, // Name of the uploaded chunk
  };

  let textractResponse;
  let retryCount = 0;
  const maxRetries = 3;
  const delayBetweenRetries = 2000; // milliseconds

  // Retry logic for Textract API
  while (retryCount < maxRetries) {
    try {
      // Add a delay between Textract API requests to avoid throttling
      await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries));

      textractResponse = await axios.post(
        "https://u1oaj2omi2.execute-api.us-east-1.amazonaws.com/textract",
        textractRequest
      );

      // Break the loop if Textract call succeeds
      break;
    } catch (error: any) {
      if (error.response && error.response.status === 503) {
        // Service Unavailable error, retry
        console.log(
          `Service Unavailable error during Textract API call for chunk ${currentIndex + 1}, retrying...`
        );
      } else {
        // Log other errors and retry
        console.log(
          `Error during Textract API call for chunk ${currentIndex + 1}, retrying...`,
          error
        );
      }
      retryCount++;

      // If max retries reached, log the error and break the loop
      if (retryCount === maxRetries) {
        console.log(
          `Textract API call for chunk ${currentIndex + 1} failed after ${maxRetries} retries`
        );
      }
    }
  }

  // Check if Textract call succeeded
  if (textractResponse) {
    const text = textractResponse.data.text || "";

    // Store the extracted text
    extractedTexts.push(text);

    // Split text into smaller parts to fit within the max token limit
    const textParts = splitTextToFitTokenLimit(
      text,
      maxAllowedTokens - maxTokens
    );

    // Process each text part with SageMaker
    let combinedSummary = "";
    for (const part of textParts) {
      const summary = await getSummaryFromSageMaker(part);
      console.log(`Received summary: ${summary}`);
      combinedSummary += summary + " ";
    }

    if (combinedSummary.trim().length > 0) {
      extractedSummaries.push(combinedSummary.trim());
    } else {
      extractedSummaries.push(""); // Handle cases where combined summary is still empty
    }
  } else {
    extractedTexts.push(""); // Push empty string if Textract call failed
    extractedSummaries.push(""); // Push empty string if Textract call failed
  }

  // Process the next chunk recursively
  return processChunks(
    pdfDoc,
    totalPages,
    splitSize,
    bucketName,
    folderName,
    subfolderName,
    subsubfolderName,
    objectKey,
    currentIndex + splitSize,
    extractedTexts,
    extractedSummaries
  );
}

function splitTextToFitTokenLimit(text: string, maxTokens: number): string[] {
  const words = text.split(" ");
  const parts = [];
  let currentPart = "";

  for (const word of words) {
    if ((currentPart + word).split(" ").length > maxTokens) {
      parts.push(currentPart.trim());
      currentPart = word + " ";
    } else {
      currentPart += word + " ";
    }
  }

  if (currentPart.trim()) {
    parts.push(currentPart.trim());
  }

  return parts;
}

async function getSummaryFromSageMaker(text: string): Promise<string> {
  const requestBody = {
    body: {
      inputs:
        text +
        " Can you provide a summary about this file content? Start the summary with 'This file is about' and summarize it in a small paragraph.",
      parameters: {
        max_new_tokens: 500, // Reduced to ensure total tokens stay within limit
        top_p: 0.9,
        temperature: 0.2,
      },
    },
  };

  const endpoint =
    "https://d55gtzdu04.execute-api.us-east-1.amazonaws.com/dev-demo/sageMakerInvoke";

  try {
    const response = await axios.post(endpoint, requestBody);
    console.log("Response from SageMaker endpoint:", response.data);
    return response.data.body || response.data.body.outputs || "";
  } catch (error: any) {
    console.error(
      "Error sending request to SageMaker endpoint:",
      error.message
    );
    return "";
  }
}
