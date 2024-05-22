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

interface Comment {
    commentId: string;
    comment: string;
}

interface Indicator {
    indicatorId: string;
    indicatorName: string;
    comments: Comment[];
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
        // logger.info(
        //     `Criteria for standard ${standardNumber}, indicator ${indicatorNumber}:`,
        //     response.data
        // );
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
        // Extract only the content fields
        const contentArray = apiResponse.data.map((item) => item.content);
  
        // Log content
        logger.info("Content found:", contentArray);
        return contentArray; // Return the extracted content
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
    // logger.info(
    //     `Generating text with Amazon Titan Text Express model ${modelId}`
    // );

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

        // logger.info(
        //     `Successfully generated text with Amazon Titan Text Express model ${modelId}`
        // );
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
        const fileName = "BUB/Standard4/Indicator10/Health_Saftey.pdf";

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
        const criteria: Indicator = await getIndicatorData(standardNumber, indicatorNumber);
        //console.log(criteria, "criteria const");
        const indicatorName = criteria.indicatorName;
        const comments = criteria.comments;
        const results = [];

        const allContent = await fetchAllContents(standardNumber, indicatorNumber);
        console.log(allContent, "all content const");

        //logger.info("Handler invoked");

        const modelId = "amazon.titan-text-express-v1";
        for (const c of comments) {
            const prompt = `
            Below is the evidence submitted by the university under the indicator "${criteria.indicatorName}":
            ${JSON.stringify(allContent)}
            
            Analyze and evaluate the university's compliance and performance based on the provided rubric criteria:
            
            ${JSON.stringify(c.comment)}

            - If the evidence does not relate to the indicator, indicate that it is not applicable (N/A) without any additional commentary.
            - evaluate the university's compliance and performance across the criteria 
            - Provide a score (1-5) for each comment, citing evidence directly from the provided content, if not related score it as N/A.
            
            (Write your response in concise bullet points, focusing strictly on relevant analysis and evidence. Limit your response to 100 words.)
            
            
            `;

            logger.info(`Prompt for comment ${c.commentId}: ${prompt}`);

            const body = JSON.stringify({
                inputText: prompt,
                textGenerationConfig: {
                    maxTokenCount: 4096,
                    stopSequences: [],
                    temperature: 0,
                    topP: 0.1,
                },
            });

            const responseBody = await generateText(modelId, body);

            const outputText = responseBody.results
                .map((result: { outputText: string }) => result.outputText)
                .join("\n\n");

            // Log the output text for this comment
            logger.info(`Output Text for comment ${c.commentId}: ${outputText}`);

            results.push({ commentId: c.commentId, outputText });
        }

        const response = {
            indicatorName: criteria.indicatorName,
            results,
        };

        logger.info(JSON.stringify(response));

        return {
            statusCode: 200,
            body: JSON.stringify(response),
        };
    } catch (err) {
        if (err instanceof Error) {
            logger.error(`An error occurred: ${err.message}`);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: err.message }),
            };
        } else {
            logger.error("An unexpected error occurred");
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "An unexpected error occurred" }),
            };
        }
    }
};

export { handler };
