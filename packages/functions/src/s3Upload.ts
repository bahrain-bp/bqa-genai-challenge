import * as AWS from 'aws-sdk';
import { Buffer } from 'buffer'; 
const s3 = new AWS.S3();
export async function uploadToS3(event: any) {
  try {
    const fileData = event.body; 
    const fileName = event.headers['file-name'];

    // Check file size before upload (optional)
    const fileSize = Buffer.byteLength(fileData);
    console.log("File size:", fileSize);

    if (!fileName) {
      throw new Error('File name not provided');
    }

    const standardNum = event.headers['standard']; 
    const indicatorNum = event.headers['indicator']; 
    const standard = String(standardNum);
    const indicator = String(indicatorNum);

    // Define metadata for the object
    const metadata = {
      "createdBy": "Amjad",
      "creationDate": new Date().toISOString(),
      "standard": standard,
      "indicator": indicator
    };

    // Define S3 upload parameters, including metadata
    const params = {
      Bucket: 'uni-artifacts',
      Key: fileName,
      Body: fileData,
      ObjectMetadata: metadata
    };

    // Upload the file with metadata
    const uploadResult = await s3.upload(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'File uploaded successfully', location: uploadResult.Location, metadata: metadata }),
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to upload file' }),
    };
  }
}
