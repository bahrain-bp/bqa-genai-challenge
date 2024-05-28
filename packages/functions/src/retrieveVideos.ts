import { APIGatewayProxyHandler } from 'aws-lambda';
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({ region: 'us-east-1' }); // Replace with your region

export const handler: APIGatewayProxyHandler = async (event: any, _context) => {
    const bucketName = 'uni-artifacts'; // Replace with your S3 bucket name
    const prefix = ''; // Adjust if needed

    try {
        const listParams = {
            Bucket: bucketName,
            Prefix: prefix,
        };

        let videoKeys = [];
        let continuationToken;

        do {
            const params = { ...listParams, ContinuationToken: continuationToken };

            const data = await s3Client.send(new ListObjectsV2Command(params));

            data.Contents.forEach((item) => {
                if (item.Key.endsWith('.mp4')) {
                    videoKeys.push(item.Key);
                }
            });

            continuationToken = data.NextContinuationToken;

        } while (continuationToken);

        return {
            statusCode: 200,
            body: JSON.stringify(videoKeys),
        };

    } catch (error) {
        console.error('Error fetching video keys:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching video keys' }),
        };
    }
};
