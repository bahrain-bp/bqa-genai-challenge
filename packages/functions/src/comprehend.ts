import * as AWS from 'aws-sdk';

const comprehend = new AWS.Comprehend();

export async function comprehendText(event: any) {
  try {
    const { text } = JSON.parse(event.body);

    // Check if text is provided
    if (!text) {
      throw new Error('Text not provided');
    }

    // Define parameters for comprehend
    const params = {
      Text: text,
      LanguageCode: 'en' // Assuming English language, adjust as needed
    };

    // Analyze the text using AWS Comprehend
    const analysisResult = await comprehend.detectSentiment(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Text analyzed successfully', result: analysisResult }),
    };
  } catch (error) {
    console.error('Error processing text:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to analyze text' }),
    };
  }
}
