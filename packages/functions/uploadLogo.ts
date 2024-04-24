import * as AWS from 'aws-sdk';
const s3 = new AWS.S3();

export async function uploadLogo(event: any) {
  try {
    const fileData = event.body; // Binary file data
    const fileName = event.headers['file-name']; // Get file name
    const { name, logo} = JSON.parse(event.body);


    if (!fileName) {
      throw new Error('File name not provided');
    }

// Get current user session
    // Define metadata for the object
   

    // Define S3 upload parameters, including metadata
    const params = {
      Bucket: 'upload-logo',
      Key: fileName,
      Body: fileData,
      ACL: 'public-read'
    };

    // Upload the file with metadata
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
