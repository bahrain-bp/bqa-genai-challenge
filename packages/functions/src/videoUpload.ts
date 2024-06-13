import { S3 } from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { Buffer } from 'buffer';

const s3 = new S3();

export const handler: APIGatewayProxyHandler = async (event: any) => {
  try {
    const { bucketName, folderName, fileName } = JSON.parse(event.body);

    // Check if all required parameters are provided
    if (!bucketName || !folderName || !fileName || !event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required parameters' }),
      };
    }

    // Decode the video file from the base64 string
    const videoBuffer = Buffer.from(event.body, 'base64');

    // Here you can add your video validation logic
    // For example, you might want to check the duration of the video file

    // Assume you have a function `getVideoDuration` that returns the video duration in seconds
    const videoDuration = await getVideoDuration(videoBuffer);
    if (videoDuration > 90) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Video duration exceeds 1:30 minutes' }),
      };
    }

    // Upload the video to S3
    const params = {
      Bucket: bucketName,
      Key: `${folderName}/video/${fileName}`,
      Body: videoBuffer,
      ContentType: 'video/mp4',
    };

    await s3.putObject(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Video uploaded successfully' }),
    };
  } catch (error) {
    console.error('Error uploading video:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error: error }),
    };
  }
};

// Helper function to get video duration
const getVideoDuration = async (videoBuffer: Buffer): Promise<number> => {
  const { getVideoDurationInSeconds } = require('get-video-duration');

  const duration = await getVideoDurationInSeconds(videoBuffer);
  return duration;
};
