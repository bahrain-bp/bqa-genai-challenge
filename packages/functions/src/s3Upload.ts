import * as AWS from 'aws-sdk';

const s3 = new AWS.S3();

export async function uploadToS3(event: any) {
  try {
    const fileData = event.body; // Binary file data directly available in the event body
    const fileName = event.headers['file-name']; // Extract file name from headers

    if (!fileName) {
      throw new Error('File name not provided');
    }

    // Define S3 upload parameters
    const params = {
      Bucket: 'uni-artifacts',
      Key: fileName,
      Body: fileData,
    };

    // Upload the file to S3
    const uploadResult = await s3.upload(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'File uploaded successfully', location: uploadResult.Location }),
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to upload file' }),
    };
  }
}
