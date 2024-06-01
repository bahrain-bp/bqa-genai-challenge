import * as AWS from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';

// Initialize AWS SDK
const lambda = new AWS.Lambda();

// Define the Lambda handler function
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Prepare the payload to be sent to the videoAnalyze Lambda function
    const payload = JSON.stringify({
      video: event.body, // Assuming the video binary is passed in the request body
    });

    // Configure the parameters for invoking the videoAnalyze Lambda function
    const params: AWS.Lambda.InvocationRequest = {
      FunctionName: 'videoAnalyze', // Name of the videoAnalyze Lambda function
      InvocationType: 'RequestResponse', // Synchronous invocation
      Payload: payload,
    };

    // Invoke the videoAnalyze Lambda function
    const response = await lambda.invoke(params).promise();

    // Return the response from the videoAnalyze Lambda function
    return {
      statusCode: 200,
      body: response.Payload?.toString() || '', // Assuming the videoAnalyze function returns a string response
    };
  } catch (error) {
    console.error('Error invoking videoAnalyze Lambda function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
