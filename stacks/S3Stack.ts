import { aws_iam as iam, aws_lambda as lambda } from "aws-cdk-lib";
import { StackContext, Queue, Function } from "sst/constructs";
import * as AWS from "aws-sdk";

export function S3Stack({ stack, app }: StackContext) {
  // Create the S3 bucket if it doesn't exist
  const bucketName = "uni-artifacts";
  createS3Bucket(stack, bucketName)
    .then(() => configureBucketPolicy(stack, bucketName, "us-east-1_QmBzINJmW"))
    .catch((error) => console.error("Error:", error));

  async function createS3Bucket(stack: any, bucketName: string): Promise<void> {
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
        console.error("Error creating bucket: ", error);
      }
    }
  }

  const handler =
    "packages/functions/src/bedrock_lambda/bedrock_prompt.handler";
  const bedrock_lambda = new Function(stack, "bedrock_lambda", {
    handler: handler,
    permissions: "*",
    timeout: "900 seconds",
  });
  // Attach AmazonS3FullAccess managed policy to the role associated with the Lambda function
  bedrock_lambda.role?.addManagedPolicy(
    iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess")
  );

  const documentsQueue = new Queue(stack, "Document-Queue", {
    consumer: {
      function: bedrock_lambda,
    },
    cdk: {
      queue: {
        fifo: true,
        // contentBasedDeduplication: true,
        queueName: stack.stage + "-documents-queue.fifo",
        contentBasedDeduplication: true,
      },
    },
  });
  documentsQueue.attachPermissions("*");

  const analysisQueue = new Queue(stack, "analysis-Queue", {
    consumer: {
      function: "packages/functions/src/standards/compareStandards.handler",
    },
    cdk: {
      queue: {
        fifo: true,
        // contentBasedDeduplication: true,
        queueName: stack.stage + "-analysis-queue.fifo",
        contentBasedDeduplication: true,
      },
    },
  });
  analysisQueue.attachPermissions("*");
  bedrock_lambda.bind([documentsQueue, analysisQueue]);

  async function configureBucketPolicy(
    stack: any,
    bucketName: string,
    cognitoPoolId: string
  ): Promise<void> {
    // Your bucket policy configuration logic here, to only allow cognito users to upload into the bucket
  }
  return { documentsQueue, analysisQueue };
}
