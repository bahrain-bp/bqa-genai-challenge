import { APIGatewayProxyHandler } from 'aws-lambda';
import { Buffer } from 'buffer';
import axios from 'axios';

export const handler: APIGatewayProxyHandler = async (event: any, _context) => {
  try {
    // Extract bucket name and file path from the event body
    const decodedDataBuffer = Buffer.from(event.body, 'base64');
    const decodedData = decodedDataBuffer.toString('utf-8'); // Convert decoded buffer to string
console.log(decodedData);
  // Parse the decoded data as JSON
  const parsedData = JSON.parse(decodedData);

  // Extract bucket name and file path
  const { bucketName, filePath } = parsedData;
      console.log(bucketName); // Should print "uni-artifacts"
    console.log(filePath); // Should print "bahrainPolytechnic/exhibition.mp4"
    // Prepare data for transferToGoogle API call
    const transferData = {
      Records: [
        {
          s3: {
            bucket: {
              name: bucketName,
            },
            object: {
              key: filePath,
            },
          },
        },
      ],
    };

    // Call transferToGoogle API
    const transferResponse = await axios.post('https://qucmchgtm8.execute-api.us-east-1.amazonaws.com/transferToGoogle', JSON.stringify(transferData));
    console.log(transferResponse.data);
    // Check for successful transfer
    if (transferResponse.status !== 200) {
      throw new Error(`Error during transfer to Google: ${transferResponse.statusText}`);
    }

    // Access Google Storage URL directly from transferResponse.data (assuming it's a string)
    const googleStorageUrl: String = transferResponse.data;

    // Prepare data for Gemini API call
    const geminiData = {
      body: googleStorageUrl,
    };

    // Call Gemini API
    const geminiResponse = await axios.post('https://qucmchgtm8.execute-api.us-east-1.amazonaws.com/gemini', JSON.stringify(geminiData));

    // Return the result from Gemini API
    return {
      statusCode: geminiResponse.status,
      body: JSON.stringify(geminiResponse.data),
    };
  } catch (error) {
    console.error('Error in orchestrateApis:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
