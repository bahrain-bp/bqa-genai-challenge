import * as AWS from 'aws-sdk';

const s3 = new AWS.S3();

export async function detect(event: any) {
  try {
    // Retrieve parameters from the event
    const fileType = event.queryStringParameters?.fileType;
    const bucketName = event.queryStringParameters?.bucketName;

    // Ensure required parameters are provided
    if (!fileType || !bucketName) {
      throw new Error('Both fileType and bucketName must be provided');
    }

    // Retrieve list of objects from the specified S3 bucket
    const s3Objects = await s3.listObjectsV2({ Bucket: bucketName }).promise();

    // Filter objects to find those with the specified file type extension
    const filesOfType = s3Objects.Contents?.filter(obj => {
      const key = obj.Key || '';
      return key.toLowerCase().endsWith('.' + fileType);
    });

    // Return list of files found with the specified file type
    return {
      statusCode: 200,
      body: JSON.stringify({ files: filesOfType }),
    };
  } catch (error) {
    console.error('Error detecting files by type:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to detect files by type' }),
    };
  }
}
