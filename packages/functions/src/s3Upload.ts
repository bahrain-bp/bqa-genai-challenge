import * as AWS from 'aws-sdk';
import { getCurrentUser } from 'aws-amplify/auth';
const s3 = new AWS.S3();

export async function uploadToS3(event: any) {
  try {
    const fileData = event.body; // Binary file data
    const fileName = event.headers['file-name']; // Get file name

    if (!fileName) {
      throw new Error('File name not provided');
    }

  
// Get current user session
const currentUser = await getCurrentUser();
if(currentUser){
console.log(currentUser.username);
}

    // Define metadata for the object
    const metadata = {
      "createdBy": currentUser.username || "anonymous",
      "creationDate": new Date().toISOString(),
      "standard": "1",
      "indicator": "2"
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
