import { BedrockRuntime } from "aws-sdk";
import { APIGatewayProxyEvent, Context, Handler } from "aws-lambda";
import * as winston from "winston";
import { Logger } from "winston";
import axios from "axios";
const logger: Logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

class ImageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageError";
  }
}

const extractStandardAndIndicator = (
  filePath: string
): { standardNumber: string | null; indicatorNumber: string | null } => {
  const parts = filePath.split("/");

  const standardPart = parts.find((part) => part.startsWith("Standard"));
  const indicatorPart = parts.find((part) => part.startsWith("Indicator"));

  const standardNumber = standardPart ? standardPart.match(/\d+/)?.[0] : null;
  const indicatorNumber = indicatorPart
    ? indicatorPart.match(/\d+/)?.[0]
    : null;

  return {
    standardNumber: standardNumber ?? "",
    indicatorNumber: indicatorNumber ?? "",
  };
};
const getIndicatorData = async (
  standardNumber: string,
  indicatorNumber: string
): Promise<void> => {
  try {
    const response = await axios.get(
      `https://u1oaj2omi2.execute-api.us-east-1.amazonaws.com/criteria/${standardNumber}/${indicatorNumber}`
    );
    logger.info(
      `Criteria for standard ${standardNumber}, indicator ${indicatorNumber}:`,
      response.data
    );
    return response.data;
  } catch (error) {
    logger.error(`Error fetching indicator data: ${(error as Error).message}`);
  }
};

const fetchAllContents = async (
  standardNumber: string,
  indicatorNumber: string
): Promise<any> => {
  // Adjust the return type as needed
  try {
    const apiUrl = `https://u1oaj2omi2.execute-api.us-east-1.amazonaws.com/files/Standard${standardNumber}/Indicator${indicatorNumber}`;
    const apiResponse = await axios.get(apiUrl);

    if (Array.isArray(apiResponse.data) && apiResponse.data.length > 0) {
      // Log content
      logger.info("Content found:", apiResponse.data);
      return apiResponse.data; // Return the fetched data
    } else {
      // Log error if content is not found or response data is not in the expected format
      logger.error(
        "No content found or response data is not in the expected format."
      );
      return null; // or throw an error if appropriate
    }
  } catch (error) {
    // Log error if there's an issue with fetching the content
    logger.error(`Error fetching contents: ${(error as Error).message}`);
    throw error; // Rethrow the error to propagate it up the call stack
  }
};

const generateText = async (modelId: string, body: string): Promise<any> => {
  logger.info(
    `Generating text with Amazon Titan Text Express model ${modelId}`
  );

  const bedrock = new BedrockRuntime();
  const accept = "application/json";
  const contentType = "application/json";

  try {
    const response = await bedrock
      .invokeModel({
        body,
        modelId,
        accept,
        contentType,
      })
      .promise();

    const responseBody = JSON.parse(response.body as string);
    const finishReason = responseBody.error;

    if (finishReason) {
      throw new ImageError(`Text generation error. Error is ${finishReason}`);
    }

    logger.info(
      `Successfully generated text with Amazon Titan Text Express model ${modelId}`
    );
    return responseBody;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate text: ${error.message}`);
    } else {
      throw new Error("Failed to generate text due to an unknown error");
    }
  }
};

const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  try {
    const fileName = "BUB/Standard1/Indicator2/Health_Saftey.pdf";

    const { standardNumber, indicatorNumber } =
      extractStandardAndIndicator(fileName);

    logger.info(`Standard Number: ${standardNumber}`);
    logger.info(`Indicator Number: ${indicatorNumber}`);

    if (!standardNumber || !indicatorNumber) {
      const errorMsg =
        "Failed to extract standard number or indicator number from the file path";
      logger.error(errorMsg);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: errorMsg }),
      };
    }
    // Call other functions using standardNumber and indicatorNumber
    const criteria = await getIndicatorData(standardNumber, indicatorNumber);
    console.log(criteria, "criteria const");

    const allContent = await fetchAllContents(standardNumber, indicatorNumber);
    console.log(allContent, "all content const");

    logger.info("Handler invoked");

    const modelId = "amazon.titan-text-express-v1";

    // for (const criterion of infrastructureCriteria) {
    const prompt = `
                Below is the content describing the university's room sizes and the infrastructure criteria for evaluation:\n\n
                ${JSON.stringify(allContent)}\n\n
                Based on the provided evidence, evaluate the university's compliance and performance across the infrastructure indicators listed below. Provide a score from 1 to 5 for each indicator, along with specific examples or evidence supporting your assessment:\n\n
                Below is the Infrastructure Criteria:\n
                while(criteria)
                
                ${JSON.stringify(criteria)}\n\n
                For each indicator:\n
                - Assign a score from 1 to 3 out of 3 based on the level of compliance and effectiveness.\n
                - Include Evaluation, supporting evidence from the provided room sizes content to justify your score with examples.\n
            
               `;

    logger.info(`Prompt: ${prompt}`);

    const body = JSON.stringify({
      inputText: prompt,
      textGenerationConfig: {
        maxTokenCount: 4096,
        stopSequences: [],
        temperature: 0,
        topP: 1,
      },
    });

    const responseBody = await generateText(modelId, body);

    // const response = { prompt, results: responseBody.results };
    // logger.info(JSON.stringify(response.results));

    // Extract and join the outputText fields from the results
    const outputTexts = responseBody.results
      .map((result: { outputText: any }) => result.outputText)
      .join("\n\n");

    // Log the outputTexts in a readable format
    logger.info(outputTexts);

    const response = { prompt, results: outputTexts };

    return response;
  } catch (err) {
    if (err instanceof Error) {
      logger.error(`An error occurred: ${err.message}`);
      return { error: err.message };
    } else {
      logger.error("An unexpected error occurred");
      return { error: "An unexpected error occurred" };
    }
  }
};

export { handler };
