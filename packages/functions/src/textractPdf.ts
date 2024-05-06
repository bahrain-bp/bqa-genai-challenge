import { APIGatewayEvent, Context } from "aws-lambda";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import {
  TextractClient,
  StartDocumentAnalysisCommand,
  GetDocumentAnalysisCommand,
} from "@aws-sdk/client-textract";
import { Writable } from "stream";
import { promisify } from "util";
import { pipeline } from "stream";

// Interface to define expected request body structure
interface TextractRequest {
  bucketName: string;
  folderName?: string;
  subfolderName?: string;
  fileName: string;
}

interface Block {
  BlockType?: string;
  Text?: string;
}
const s3Client = new S3Client({ region: process.env.AWS_REGION });
const textractClient = new TextractClient({ region: process.env.AWS_REGION });

export const extractTextFromPDF = async (
  event: APIGatewayEvent,
  context: Context
) => {
  try {
    const requestBody: TextractRequest = JSON.parse(event.body || "{}");
    console.log("Request Body:", requestBody);

    // Validate parameters
    if (!requestBody.fileName) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing required parameter: fileName",
        }),
      };
    }

    const {
      bucketName,
      folderName = "",
      subfolderName = "",
      fileName,
    } = requestBody;

    // Construct the S3 object key with optional folder structure
    const objectKey = `${folderName ? folderName + "/" : ""}${subfolderName ? subfolderName + "/" : ""}${fileName}`;
    console.log("Object Key:", objectKey);

    // Download the PDF from S3
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });
    const pdfData = await s3Client.send(getObjectCommand);
    //console.log('PDF Data:', pdfData);

    // Read the stream and store its content in a buffer
    const buffer = await streamToBuffer(pdfData.Body as NodeJS.ReadableStream);

    if (!buffer || !(buffer instanceof Buffer)) {
      throw new Error("PDF data is empty or not a buffer.");
    }

    // Use Textract to start document analysis
    const startDocumentAnalysisCommand = new StartDocumentAnalysisCommand({
      DocumentLocation: {
        S3Object: {
          Bucket: bucketName,
          Name: objectKey,
        },
      },
      FeatureTypes: ["TABLES", "FORMS"],
    });
    //console.log('Start Document Analysis Command:', startDocumentAnalysisCommand);

    // Start document analysis job
    const startAnalysisResponse = await textractClient.send(
      startDocumentAnalysisCommand
    );
    console.log(">>>>>>>>>Start Analysis Response:");

    // Check if the analysis job started successfully
    if (!startAnalysisResponse.JobId) {
      throw new Error("Failed to start document analysis job.");
    }

    // Wait for analysis job to complete
    const jobId = startAnalysisResponse.JobId;
    const getDocumentAnalysisCommand = new GetDocumentAnalysisCommand({
      JobId: jobId,
    });
    const analysisResult = await waitForAnalysisCompletion(
      getDocumentAnalysisCommand
    );
    console.log(">>>>>>>>Analysis Result:");

    // Extract text from analysis result
    let extractedText = "";
    if (analysisResult.Blocks) {
      extractedText = analysisResult.Blocks.filter(
        (block: Block) => block.BlockType === "LINE"
      ).map((block: Block) => block.Text?.trim() || "");
    }
    console.log("Extracted Text:", extractedText);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Text extracted successfully",
        text: extractedText,
      }),
    };
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to extract text from PDF" }),
    };
  }
};

// Function to convert stream to buffer
const pipelineAsync = promisify(pipeline);

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  stream.on("data", (chunk: Buffer) => {
    chunks.push(chunk);
  });
  await pipelineAsync(
    stream,
    new Writable({
      write(chunk, encoding, callback) {
        callback();
      },
    })
  );
  return Buffer.concat(chunks);
}

// Function to wait for document analysis job completion
async function waitForAnalysisCompletion(
  command: GetDocumentAnalysisCommand
): Promise<any> {
  const maxRetries = 30;
  let retries = 0;
  while (retries < maxRetries) {
    const response = await textractClient.send(command);
    if (response.JobStatus === "SUCCEEDED" || response.JobStatus === "FAILED") {
      return response;
    }
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before checking again
    retries++;
  }
  throw new Error("Analysis job did not complete within the expected time.");
}
