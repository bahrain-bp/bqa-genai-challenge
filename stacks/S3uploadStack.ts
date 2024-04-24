import { StackContext } from 'sst/constructs';
import * as AWS from 'aws-sdk';

export function S3uploadStack({ stack, app }: StackContext) {
  // Create the S3 bucket if it doesn't exist
  const bucketName = 'upload-logo';
  createS3Bucket(stack, bucketName)
    .then(() => configureBucketPolicy(stack, bucketName, 'us-east-1_PraHctOMo'))
    //us-east-1_QmBzINJmW or   us-east-1_PraHctOMo'
    .catch(error => console.error('Error:', error));

  async function createS3Bucket(stack: any, bucketName: string): Promise<void> {
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3();
    try {
      // Check if the bucket already exists
      await s3.headBucket({ Bucket: bucketName }).promise();
      console.log(`Bucket "${bucketName}" already exists.`);
    } catch (error) {
      // Bucket doesn't exist, create it
      try {
        await s3.createBucket({ Bucket: bucketName }).promise();
        console.log(`Bucket "${bucketName}" created successfully.`);
      } catch (error) {
        console.error('Error creating bucket: ', error);
      }
    }
  }

  async function configureBucketPolicy(stack: any, bucketName: string, cognitoPoolId: string): Promise<void> {
    // Your bucket policy configuration logic here, to only allow cognito users to upload into the bucket
  }
}
