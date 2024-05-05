import * as AWS from 'aws-sdk';

const comprehend = new AWS.Comprehend();

const MAX_TEXT_SIZE = 5000; // Maximum allowed size for AWS Comprehend input text
const MAX_SUMMARY_LENGTH = 500; // Maximum length for the summary

function splitTextByLogicalBoundaries(text: string): string[] {
  const sentences = text.split(/[.!?]/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk.length + sentence.length) <= MAX_TEXT_SIZE) {
      currentChunk += sentence + '.';
    } else {
      chunks.push(currentChunk.trim());
      currentChunk = sentence + '.';
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

async function splitTextAndSummarize(text: string) {
  try {
    // Split the text into chunks based on logical boundaries
    const chunks = splitTextByLogicalBoundaries(text);

    // Summarize each chunk separately
    const summaries = [];
    for (const chunk of chunks) {
      const params = {
        Text: chunk,
        LanguageCode: 'en'
      };
      const keyPhraseResult = await comprehend.detectKeyPhrases(params).promise();
      if (keyPhraseResult.KeyPhrases) {
        const chunkSummary = keyPhraseResult.KeyPhrases.map(phrase => phrase.Text).join(' ');
        summaries.push(chunkSummary);
      }
    }

    // Combine and summarize all chunks into a single summary
    const combinedSummary = summaries.join(' ');
    return combinedSummary.substring(0, MAX_SUMMARY_LENGTH); // Limit summary length
  } catch (error) {
    console.error('Error processing text:', error);
    throw new Error('Failed to summarize text');
  }
}

export async function comprehendText(event: any) {
  try {
    const { text } = JSON.parse(event.body);

    // Check if text is provided
    if (!text) {
      throw new Error('Text not provided');
    }

    // Split and summarize the text
    const summary = await splitTextAndSummarize(text);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Text summarized successfully', summary }),
    };
  } catch (error) {
    console.error('Error processing text:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to summarize text' }),
    };
  }
}
