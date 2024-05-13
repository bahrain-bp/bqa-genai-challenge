import * as AWS from 'aws-sdk';
import { PageSizes, PDFDocument, PDFPage } from 'pdf-lib';

const s3 = new AWS.S3();

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

    for (let i = 0; i < totalPages; i += splitSize) {
        const endPage = Math.min(i + splitSize, totalPages);
      
        // Copy pages
        const copiedPagesPromise = pdfDoc.copyPages(pdfDoc, Array.from({ length: endPage - i }, (_, index) => index + i));
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
            Bucket: bucketName,
            Key: `${objectKey}-split-${i + 1}.pdf`,
            Body: splitPDFBytes,
            ContentType: 'application/pdf', // Set the content type accordingly
        }).promise();
    }

    // Return success message
    return { message: 'Split PDF files uploaded successfully' };

  } catch (error) {
    console.error('Error:', error);
    throw error; 
  }
};
