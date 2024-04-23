import * as AWS from 'aws-sdk';
import { Buffer } from 'buffer'; 

const s3 = new AWS.S3();

async function createFolder(bucketName: string, folderPath: string) {
  try {
    // Check if the folder exists
    const params = {
      Bucket: bucketName,
      Prefix: folderPath,
      Delimiter: '/'
    };
    const data = await s3.listObjectsV2(params).promise();

    // If the folder doesn't exist, create it
    if (!data.CommonPrefixes?.length) {
      const folders = folderPath.split('/');
      let folderKey = '';
      for (const folder of folders) {
        folderKey += folder + '/';
        await s3.putObject({
          Bucket: bucketName,
          Key: folderKey,
          Body: ''
        }).promise();
      }
    }
  } catch (error) {
    console.error('Error creating folder:', error);
    throw new Error('Failed to create folder');
  }
}

export async function uploadToS3(event: any) {
  try {
    const fileData = event.body; 
    const fileName = event.headers['file-name'];
    const bucketName = event.headers['bucket-name'];
    const folderName = event.headers['folder-name'];
    const subfolderName = event.headers['subfolder-name'];

    // Check file size before upload (optional)
    const fileSize = Buffer.byteLength(fileData);
    console.log("File size:", fileSize);

    if (!fileName) {
      throw new Error('File name not provided');
    }

    if (!bucketName) {
      throw new Error('Bucket name not provided');
    }

    if (!folderName) {
      throw new Error('Folder name not provided');
    }

    // Combine folder and subfolder name if subfolder is provided
    const folderPath = subfolderName ? `${folderName}/${subfolderName}` : folderName;

    // Create folder if it doesn't exist
    await createFolder(bucketName, folderPath);

    // Define S3 upload parameters
    const params = {
      Bucket: bucketName,
      Key: `${folderPath}/${fileName}`, // Combine folder path and file name for Key
      Body: fileData,
    };

    // Upload the file
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
