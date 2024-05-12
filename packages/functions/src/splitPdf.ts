import * as AWS from "aws-sdk";
import { APIGatewayEvent, Context } from 'aws-lambda'; // Import the APIGatewayEvent interface

const jspdf = require('jspdf');

const s3 = new AWS.S3({ region: process.env.AWS_REGION });

export const handler = async (event: APIGatewayEvent, context: Context) => {
    try {
        // Extract parameters from event body
        const { bucketName, folderName, subfolderName, fileName } = JSON.parse(event.body!);
    
        // Validate required parameters
        if (!bucketName || !fileName) {
          return {
            statusCode: 400,
            body: JSON.stringify({
              message: 'Missing required parameters: bucketName and fileName are required.',
            }),
          };
        }
    
  

    // Build object key
    const objectKey = `${folderName ? folderName + '/' : ''}${subfolderName ? subfolderName + '/' : ''}${fileName}`;

    // Download PDF from S3
    const downloadParams = { Bucket: bucketName, Key: objectKey };
    const downloadResponse = await s3.getObject(downloadParams).promise();
    const pdfData = downloadResponse.Body;

    // Check if downloaded data is empty
    if (!pdfData) {
      console.error('Downloaded data is empty');
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Failed to download PDF from S3 (empty data)' }),
      };
    }

    // Define chunk size
    const chunkSize = 10; // Modify this value to adjust chunk size (in pages)

    // Load PDF document using jsPDF
    const doc = new jspdf();
    await doc.load(pdfData); 

    // Get total number of pages
    const totalPages = doc.internal.getNumberOfPages();

    // Split PDF into chunks
    const chunks = [];
    for (let i = 0; i < totalPages; i += chunkSize) {
      const end = Math.min(i + chunkSize, totalPages);
      const chunkDoc = new jspdf();
      for (let page = i; page < end; page++) {
        await chunkDoc.addPage(doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
        chunkDoc.setPage(page + 1); // jsPDF starts page numbering at 1
        chunkDoc.copyPages(doc, [page], { translate: 0, scale: 1 });
      }
      chunks.push(chunkDoc);
    }

    // Upload each chunk to S3
    const uploadedFiles = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunkBuffer = await chunks[i].output('blob');
      const chunkKey = `${objectKey}_chunk_${i + 1}.pdf`;
      const uploadParams = { Bucket: bucketName, Key: chunkKey, Body: chunkBuffer };
      await s3.putObject(uploadParams).promise();
      uploadedFiles.push(chunkKey);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'PDF split successfully',
        uploadedFiles,
      }),
    };
  } catch (error) {
    console.error('Error splitting PDF:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to split PDF' }),
    };
  }
};
