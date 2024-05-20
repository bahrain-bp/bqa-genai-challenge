import { APIGatewayEvent, Context } from "aws-lambda";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { TextractClient, StartDocumentTextDetectionCommand, GetDocumentTextDetectionCommand } from "@aws-sdk/client-textract";
import { promisify } from "util";
import { pipeline } from "stream";
import { Writable } from "stream";

// Interface to define expected request body structure
interface TextractRequest {
  bucketName: string;
  folderName?: string;
  subfolderName?: string;
  subsubfolderName?: string; // Added subsubfolderName
  fullKey?: string; // Optional parameter for full object key
  fileName: string; // Parameter for chunked file name
}

interface Block {
  BlockType?: string;
  Text?: string;
}

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const textractClient = new TextractClient({ region: process.env.AWS_REGION });

export const fetchTextFromPDF = async (event: APIGatewayEvent, context: Context) => {
  try {
    const requestBody: TextractRequest = JSON.parse(event.body || "{}");
    console.log("Request Body:", requestBody);

    // Validate parameters
    if (!requestBody.fileName && !requestBody.fullKey) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing required parameter: fileName or fullKey",
        }),
      };
    }

    const {
      bucketName,
      folderName = "",
      subfolderName = "",
      subsubfolderName = "", // Added subsubfolderName
      fullKey,
      fileName,
    } = requestBody;

    // Determine the object key based on whether fullKey is provided
    const objectKey = fullKey ? fullKey :
      `${folderName ? folderName + "/" : ""}${subfolderName ? subfolderName + "/" : ""}${subsubfolderName ? subsubfolderName + "/" : ""}${fileName}`;

    console.log("Object Key:", objectKey);

    // Download the PDF from S3
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey, // Use objectKey instead of fullKey
    });
    const pdfData = await s3Client.send(getObjectCommand);

    // Read the stream and store its content in a buffer
    const buffer = await streamToBuffer(pdfData.Body as NodeJS.ReadableStream);

    if (!buffer || !(buffer instanceof Buffer)) {
      throw new Error("PDF data is empty or not a buffer.");
    }

    // Use Textract to start document text detection
    const startDocumentTextDetectionCommand = new StartDocumentTextDetectionCommand({
      DocumentLocation: {
        S3Object: {
          Bucket: bucketName,
          Name: objectKey, // Use objectKey instead of fullKey
        },
      },
    });

    // Start document text detection job
    const startTextDetectionResponse = await textractClient.send(startDocumentTextDetectionCommand);

    // Check if the text detection job started successfully
    if (!startTextDetectionResponse.JobId) {
      throw new Error("Failed to start document text detection job.");
    }

    // Wait for text detection job to complete
    const jobId = startTextDetectionResponse.JobId;
    const getDocumentTextDetectionCommand = new GetDocumentTextDetectionCommand({
      JobId: jobId,
    });
    const textDetectionResult = await waitForTextDetectionCompletion(getDocumentTextDetectionCommand);

    // Extract text from text detection result
    let extractedText = "";
    if (textDetectionResult.Blocks) {
      extractedText = textDetectionResult.Blocks.filter(
        (block: Block) => block.BlockType === "LINE"
      ).map((block: Block) => block.Text?.trim() || "").join(' ');
    }
    console.log("Extracted Text:", extractedText);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Text fetched successfully",
        text: extractedText,
      }),
    };
  } catch (error) {
    console.error("Error fetching text from PDF:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to fetch text from PDF" }),
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

// Function to wait for document text detection job completion
async function waitForTextDetectionCompletion(command: GetDocumentTextDetectionCommand): Promise<any> {
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
  throw new Error("Text detection job did not complete within the expected time.");
}
