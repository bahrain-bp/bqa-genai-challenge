import { BedrockRuntime } from "aws-sdk";
import { APIGatewayProxyEvent, Context, Handler } from "aws-lambda";
import * as winston from "winston";
import { Logger } from "winston";
import axios from "axios";
import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
import { randomUUID } from "crypto";

// Create an instance of DynamoDB DocumentClient
const dynamoDb = new DynamoDB.DocumentClient();
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

interface CriteriaResponse {
  standardId: string;
  standardName: string;
  indicators: Indicator[];
}

interface ComparisonResult {
  comparisonId: number; // Adjust as needed
  standardNumber: string;
  standardName: string;
  uniName: string;
  indicatorNumber: number; // Assuming indicatorNumber is a number
  indicatorName: string;
  comment: string;
  outputText: string;
  timestamp: string;
}

interface Indicator {
  indicatorId: string;
  indicatorName: string;
  comments: Comment[];
}

interface CriteriaResponse {
  standardId: string;
  standardName: string;
  indicators: Indicator[];
}

interface ComparisonResult {
  comparisonId: number; // Adjust as needed
  standardNumber: string;
  standardName: string;
  uniName: string;
  indicatorNumber: number; // Assuming indicatorNumber is a number
  indicatorName: string;
  comment: string;
  outputText: string;
  timestamp: string;
}

const CHUNK_SIZE = 4096; // Token limit for each chunk

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
): Promise<CriteriaResponse | undefined> => {
  try {
    const apiURL = `https://u1oaj2omi2.execute-api.us-east-1.amazonaws.com/criteria/${standardNumber}/${indicatorNumber}`;
    const response = await axios.get(apiURL);
    const data = response.data;

    // Check if the response contains all required properties
    if (
      data &&
      data.standardId &&
      data.standardName &&
      data.indicator &&
      data.indicator.indicatorId &&
      data.indicator.indicatorName &&
      Array.isArray(data.indicator.comments)
    ) {
      return {
        standardId: data.standardId,
        standardName: data.standardName,
        indicators: [
          {
            indicatorId: data.indicator.indicatorId,
            indicatorName: data.indicator.indicatorName,
            comments: data.indicator.comments,
          },
        ],
      };
    } else {
      logger.error("Invalid data structure in API response");
      return undefined;
    }
  } catch (error) {
    logger.error(`Error fetching indicator data: ${(error as Error).message}`);
    return undefined;
  }
};

const fetchAllContents = async (
  uniName: string,
  standardNumber: string,
  indicatorNumber: string
): Promise<any> => {
  try {
    const apiUrl = `https://u1oaj2omi2.execute-api.us-east-1.amazonaws.com/files/${uniName}/Standard${standardNumber}/Indicator${indicatorNumber}`;
    console.log("apiURL Content", apiUrl);
    const apiResponse = await axios.get(apiUrl);
    console.log("API Response:", apiResponse.data);
    if (Array.isArray(apiResponse.data) && apiResponse.data.length > 0) {
      const contentArray = apiResponse.data.map((item) => item.content);
      logger.info("Content found:", contentArray);
      return contentArray;
    } else {
      return {
        statusCode: 404, // Set status code to 204 (No Content)
        body: JSON.stringify({
          message: "No content found for the specified standard and indicator.",
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500, // Set status code to 204 (No Content)
      body: JSON.stringify({

        message: (`Error fetching contents: ${(error as Error).message}`),
      }),
    };
  }
};

const generateText = async (modelId: string, body: string): Promise<any> => {
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

    return responseBody;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate text: ${error.message}`);
    } else {
      throw new Error("Failed to generate text due to an unknown error");
    }
  }
};

const chunkContent = (
  contentArray: string[],
  chunkSize: number
): string[][] => {
  const chunks: string[][] = [];
  let currentChunk: string[] = [];
  let currentSize = 0;

  for (const content of contentArray) {
    const contentSize = content.length; // Adjust this if calculating actual tokens

    if (currentSize + contentSize > chunkSize) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentSize = 0;
    }

    currentChunk.push(content);
    currentSize += contentSize;
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
};
const updateComparisonStatus = async (
  processId: string,
  status: string,
  processName: string,
  uniName: string,
  standardNumber: string,
  indicatorNumber: string
) => {
  const combinedKey = `${uniName}-${standardNumber}-${indicatorNumber}`; // Concatenate standardNumber and indicatorNumber

  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: Table.statusTable.tableName,
    Item: {
      processId,
      status,
      processName,
      uniName,
      standardNumber,
      indicatorNumber,
      timestamp: new Date().toISOString(), // Optional: Add a timestamp
      combinedKey: combinedKey,
    },
  };

  try {
    await dynamoDb.put(params).promise();
    logger.info(
      `Inserted/Updated status to ${status} for processId ${processId}`
    );
  } catch (error) {
    logger.error(
      `Failed to insert/update status for processId ${processId}: ${(error as Error).message}`
    );
  }
};

const handler: Handler = async (event: any, context: Context) => {
  try {
    const uniName = event.headers["uni-name"];
    const standardNum = event.headers["standard-number"];
    const indicatorNum = event.headers["indicator-number"];

    if (!uniName || !standardNum || !indicatorNum) {
      const errorMsg =
        "Missing required headers: uniName, standardNumber, or indicatorNumber";
      logger.error(errorMsg);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: errorMsg }),
      };
    }
    const processId = randomUUID();
    await updateComparisonStatus(
      processId,
      "Processing",
      "Comparing Process",
      uniName,
      standardNum,
      indicatorNum
    );
    logger.info(`Uni name: ${uniName}`);
    logger.info(`Standard Number: ${standardNum}`);
    logger.info(`Indicator Number: ${indicatorNum}`);

    const criteriaResponse: CriteriaResponse | undefined =
      await getIndicatorData(standardNum, indicatorNum);

    if (
      !criteriaResponse ||
      !criteriaResponse.indicators ||
      !Array.isArray(criteriaResponse.indicators)
    ) {
      await updateComparisonStatus(
        processId,
        "Failed",
        "Comparing Process",
        uniName,
        standardNum,
        indicatorNum
      );

      logger.error("Failed to fetch criteria data or invalid data structure");
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Failed to fetch criteria data or invalid data structure",
        }),
      };
    }

    const { standardName, indicators } = criteriaResponse;
    const results = [];

    for (const indicator of indicators) {
      const indicatorName = indicator.indicatorName;
      const comments = indicator.comments;

      const allContent = await fetchAllContents(
        uniName,
        standardNum,
        indicatorNum
      );
      if (!allContent) {
        await updateComparisonStatus(
          processId,
          "Failed",
          "Comparing Process",
          uniName,
          standardNum,
          indicatorNum
        );

        logger.error("No content found for the given standard and indicator");
        return {
          statusCode: 404,
          body: JSON.stringify({
            error: "No content found for the given standard and indicator",
          }),
        };
        continue;
      }

    //  const contentChunks = chunkContent(allContent, CHUNK_SIZE);

      for (const c of comments) {
        const aggregatedOutput = [];

      //  for (const chunk of contentChunks) {
          const prompt = `
            Below is the evidence submitted by the university under the indicator "${indicatorName}":
            ${JSON.stringify(allContent)}

            Analyze and evaluate the university's compliance and performance based on the provided rubric criteria:

            ${JSON.stringify(c.comment)}

            - If the evidence does not relate to the indicator, indicate that it is not applicable (N/A) without any additional commentary.
            - Evaluate the university's compliance and performance across the criteria.
            - Provide a score (1-5) for each comment, citing evidence directly from the provided content, if not related score it as N/A.

            Write your response in concise bullet points, focusing strictly on relevant analysis and evidence. **Limit your response to 100 words only.**
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

          const responseBody = await generateText(
            "amazon.titan-text-express-v1",
            body
          );
          const outputText = responseBody.results
            .map((result: { outputText: string }) => result.outputText)
            .join("\n\n");

          aggregatedOutput.push(outputText);
        

       // const finalOutputText = aggregatedOutput.join("\n\n");

        logger.info(
          `Output Text for comment ${c.commentId}: ${outputText}`
        );

        results.push({ commentId: c.commentId, outputText: outputText });

        try {
          const params = {
            TableName: Table.ComparisonResult_Table.tableName,
            Item: {
              comparisonId: Math.random(),
              standardNumber: standardNum,
              standardName: standardName,
              uniName: "BUB",
              indicatorNumber: parseInt(indicatorNum),
              indicatorName: indicatorName,
              comment: c.comment,
              outputText: outputText,
              timestamp: new Date().toISOString(),
            },
          };

          await dynamoDb.put(params).promise();
        } catch (error) {
          await updateComparisonStatus(
            processId,
            "Failed",
            "Comparing Process",
            uniName,
            standardNum,
            indicatorNum
          );

          logger.error(
            `Error saving to DynamoDB for comment ${c.commentId}: ${(error as Error).message}`
          );
        }
      }
      await updateComparisonStatus(
        processId,
        "Completed",
        "Comparing Process",
        uniName,
        standardNum,
        indicatorNum
      );

      const response = {
        indicatorName: indicatorName,
        results,
      };

      logger.info(JSON.stringify(response));

      return {
        statusCode: 200,
        body: JSON.stringify(response),
      };
    }
  } catch (err) {
    if (err instanceof Error) {
      logger.error(
        `An error occurred: ${"No content for this standard and indicator"}`
      );
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "No content for this standard and indicator",
        }),
      };
    } else {
      logger.error("An unexpected error occurred");
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "An unexpected error occurred",
        }),
      };
    }
  }
};

export { handler };
