import * as AWS from 'aws-sdk';
import { PageSizes, PDFDocument, PDFPage } from 'pdf-lib';
const axios = require("axios");

const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: any) => {
  try {
    // Extract parameters from event headers with meaningful names
    const bucketName = event.headers['bucket-name'];
    const key = event.headers['file-name'] || 'unnamed.pdf'; // Default filename if absent
    const folderName = event.headers['folder-name'] || '';
    const subfolderName = event.headers['subfolder-name'] || '';

    // Validate required parameters
    if (!bucketName || !key) {
      throw new Error('Missing required parameters: Bucket and file key');
    }

    // Construct S3 object key with optional folder/subfolder structure
    const objectKey = `${folderName ? folderName + '/' : ''}${subfolderName ? subfolderName + '/' : ''}${key}`;

    // Download the PDF file from S3
    const response = await s3.getObject({ Bucket: bucketName, Key: objectKey }).promise();

    // Check if Body exists in the response
    if (!response.Body) {
      throw new Error('Failed to retrieve PDF file from S3');
    }

    // Convert Body to ArrayBuffer
    let arrayBuffer: ArrayBuffer;

    // Handle different types of Body
    if (typeof response.Body === 'string') {
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
      throw new Error('Unsupported type of Body');
    }

    // Load PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // Split the PDF into smaller documents
    const totalPages = pdfDoc.getPages().length;
    const splitSize = 2; // Adjust split size as needed

    // Process chunks sequentially
    const extractedTexts = await processChunks(pdfDoc, totalPages, splitSize, objectKey);

    // Construct the request body for the POST request to /createFileDB endpoint
    const requestBody = {
      fileName: key, // Original file name
      fileURL: `s3://${bucketName}/${objectKey}`, // S3 URL of the file
      standardName: '', // Fill with appropriate data
      standardNumber: '', // Fill with appropriate data
      indicatorNumber: '', // Fill with appropriate data
      name: '', // Fill with appropriate data
      content: extractedTexts.join('\n'), // Full extracted text
      summary: '', // Fill with appropriate data
      strength: '', // Fill with appropriate data
      weakness: '', // Fill with appropriate data
      score: '', // Fill with appropriate data
      comments: '' // Fill with appropriate data
    };

    // Make a POST request to the /createFileDB endpoint to insert data into DynamoDB
    const apiResponse = await axios.post('https://qucmchgtm8.execute-api.us-east-1.amazonaws.com/createFileDB', requestBody);

    // Return success response
    return {
      statusCode: apiResponse.status,
      body: JSON.stringify({ message: 'Full extracted text stored in DynamoDB' }),
    };

  } catch (error) {
    console.log('Error during processing:', error);
    // Return error response
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing request' }),
    };
  }
};

async function processChunks(pdfDoc: PDFDocument, totalPages: number, splitSize: number, objectKey: string, currentIndex: number = 0, extractedTexts: string[] = []): Promise<string[]> {
  if (currentIndex >= totalPages) {
    // All chunks processed, return the extracted texts
    return extractedTexts;
  }

  const endPage = Math.min(currentIndex + splitSize, totalPages);

  // Copy pages
  const copiedPagesPromise = pdfDoc.copyPages(pdfDoc, Array.from({ length: endPage - currentIndex }, (_, index) => index + currentIndex));
  const copiedPages: PDFPage[] = await copiedPagesPromise;

  // Create a new PDF document for the split
  const splitDoc = await PDFDocument.create();

  // Add copied pages to the new document
  for (const copiedPage of copiedPages) {
    const clonedPage = await splitDoc.embedPage(copiedPage);
    const newPage = splitDoc.addPage([copiedPage.getWidth(), copiedPage.getHeight()]);
    newPage.drawPage(clonedPage);
  }

  // Save the split PDF into a buffer
  const splitPDFBytes = await splitDoc.save();

  // Upload the split PDF file to the same S3 bucket and key
  await s3.putObject({
    Bucket: 'uni-artifacts',
    Key: `${objectKey}-split-${currentIndex + 1}.pdf`,
    Body: splitPDFBytes,
    ContentType: 'application/pdf', // Set the content type accordingly
  }).promise();

  let textractResponse;
  let retryCount = 0;
  const maxRetries = 3;
  const delayBetweenRetries = 2000; // milliseconds

  // Retry logic for Textract API
  while (retryCount < maxRetries) {
    try {
      // Add a delay between Textract API requests to avoid throttling
      await new Promise(resolve => setTimeout(resolve, delayBetweenRetries)); 

      const textractRequest = {
        bucketName: 'uni-artifacts',
        folderName: 'bahrainPolytechnic',
        subfolderName:'standard1',
        fullKey: `${objectKey}-split-${currentIndex + 1}.pdf`, // Name of the uploaded chunk
      };

      textractResponse = await axios.post('https://qucmchgtm8.execute-api.us-east-1.amazonaws.com/textract', textractRequest);

      // Break the loop if Textract call succeeds
      break;
    } catch (error: any) {
      if (error.response && error.response.status === 503) {
        // Service Unavailable error, retry
        console.log(`Service Unavailable error during Textract API call for chunk ${currentIndex + 1}, retrying...`);
      } else {
        // Log other errors and retry
        console.log(`Error during Textract API call for chunk ${currentIndex + 1}, retrying...`, error);
      }
      retryCount++;

      // If max retries reached, log the error and break the loop
      if (retryCount === maxRetries) {
        console.log(`Textract API call for chunk ${currentIndex + 1} failed after ${maxRetries} retries`);
      }
    }
  }

  // Check if Textract call succeeded
  if (textractResponse) {
    extractedTexts.push(textractResponse.data.text || '');
  } else {
    extractedTexts.push(''); // Push empty string if Textract call failed
  }

  // Process the next chunk recursively
  return processChunks(pdfDoc, totalPages, splitSize, objectKey, currentIndex + splitSize, extractedTexts);
}
