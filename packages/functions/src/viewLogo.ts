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

    try {
      const s3Object = await s3.getObject(s3Params).promise();

      if (!s3Object.Body) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "File not found" }),
        };
      }

      const base64Data = s3Object.Body.toString("base64");

      // Determine content type based on file extension
      let contentType = "application/octet-stream";
      const fileExtension = fileKey.split(".").pop().toLowerCase();
      switch (fileExtension) {
        case "png":
          contentType = "image/png";
          break;
        case "jpg":
        case "jpeg":
          contentType = "image/jpeg";
          break;
        // Add more cases for other image formats as needed
        default:
          contentType = "application/octet-stream"; // Fallback to binary data
          break;
      }

      // Set response headers with Content-Type
      const response: APIGatewayProxyResultV2 = {
        statusCode: 200,
        headers: {
          "Content-Type": contentType,
        },
        isBase64Encoded: true,
        body: base64Data,
      };

      return response;
    } catch (error) {
      //console.error("Error retrieving file from S3:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal Server Error" }),
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
