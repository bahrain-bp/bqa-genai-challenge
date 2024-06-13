import { APIGatewayProxyHandler } from 'aws-lambda';
import { Buffer } from 'buffer';
import axios from 'axios';

export const handler: APIGatewayProxyHandler = async (event: any, _context) => {
  try {
    // Extract standardId, indicatorId, bucket name and file path
    const decodedDataBuffer = Buffer.from(event.body, 'base64');
    const decodedData = decodedDataBuffer.toString('utf-8');
    const parsedData = JSON.parse(decodedData);
    const { bucketName, filePath, standardId, indicatorId } = parsedData;

    console.log('Decoded data:', decodedData);
    console.log('Bucket name:', bucketName);
    console.log('File path:', filePath);
    console.log('Standard:' ,standardId);
    console.log('Indicator:' ,indicatorId);

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
    
    // Call videoPrompt API with standardId and indicatorId
    // Prepare data for videoPrompt API call
    const videoPromptData = {
      "standardId": standardId,
      "indicatorId": indicatorId,
      
    };

    // Call videoPrompt API with standardId and indicatorId in request body
    const videoPromptResponse = await axios.post('https://qucmchgtm8.execute-api.us-east-1.amazonaws.com/videoPrompt', videoPromptData);
    
    if (videoPromptResponse.status !== 200) {
      throw new Error(`Error during videoPrompt API call: ${videoPromptResponse.statusText}`);
    }

    const videoPromptText = videoPromptResponse.data.text; // Extract text from videoPrompt response

    // Call transferToGoogle API
    const transferResponse = await axios.post('https://u1oaj2omi2.execute-api.us-east-1.amazonaws.com/transferToGoogle', JSON.stringify(transferData));
    console.log('Transfer response data:', transferResponse.data);

    if (transferResponse.status !== 200) {
      throw new Error(`Error during transfer to Google: ${transferResponse.statusText}`);
    }

    // Access Google Storage URL directly from transferResponse.data
    const googleStorageUrl: string = transferResponse.data;

    // Prepare data for Gemini API call
    const geminiData = {
      cloudStorageUri: googleStorageUrl, // Use text from videoPrompt API
      text: videoPromptResponse.data.prompt
    };

    // Wait for 2 seconds before calling Gemini API
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Call Gemini API
    const geminiResponse = await axios.post('https://qucmchgtm8.execute-api.us-east-1.amazonaws.com/gemini', JSON.stringify(geminiData));

    if (geminiResponse.status !== 200) {
      throw new Error(`Error during Gemini API call: ${geminiResponse.statusText}`);
    }

    console.log('Gemini response data:', geminiResponse.data);

    // Return the result (you can modify this to include videoPromptResponse data)
    return {
      statusCode: 200,
      body: JSON.stringify(geminiResponse.data),
    };
  } catch (error) {
    console.error('Error in videoFlow:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error: error }),
    };
  }
};