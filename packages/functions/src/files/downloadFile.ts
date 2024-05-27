import { APIGatewayProxyResultV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import AWS from "aws-sdk";

// Initialize AWS SDK
const s3 = new AWS.S3();

export const main: APIGatewayProxyHandlerV2 = async (
  event: any
): Promise<APIGatewayProxyResultV2> => {
  try {
    // Extract the JSON data from the URL parameters
    const jsonData = JSON.parse(event.queryStringParameters?.data || "{}");
    const fileKey = jsonData.fileKey;

    if (!fileKey) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "File key is missing" }),
      };
    }

    // Retrieve the file from S3
    const s3Params = {
      Bucket: "uni-artifacts",
      Key: fileKey,
    };

    const s3Object = await s3.getObject(s3Params).promise();

    // Check if s3Object.Body exists before using it
    if (!s3Object.Body) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "File not found" }),
      };
    }

    // Set response headers to trigger file download
    const response: APIGatewayProxyResultV2 = {
      statusCode: 200,
      headers: {
        "Content-Type": s3Object.ContentType || "",
        "Content-Disposition": `attachment; filename="${fileKey}"`,
      },
      isBase64Encoded: true,
      body: s3Object.Body.toString("base64"),
    };

    return response;
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
