 import { SQSEvent } from "aws-lambda";
import axios, { AxiosResponse } from "axios";
 
// Variable to store processed message IDs
let processedMessageIds: Set<string> = new Set();
 
export async function handler(event: SQSEvent) {
  try {
    const records: any[] = event.Records;
 
    // Check if the message ID has been processed before
    if (processedMessageIds.has(records[0].messageId)) {
      console.log(`Duplicate message received: "${records[0].messageId}"`);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Duplicate message received" }),
      };
    }
 
    // Add message ID to the set of processed message IDs
    processedMessageIds.add(records[0].messageId);
 
    console.log(`Message processed: "${records[0].body}"`);
 
    // Extract bucketName, folderName, subfolderName, and fileName from the URL
    const urlParts = records[0].body.split("/");
    const bucketName = "uni-artifacts";
    const folderName = urlParts[3];
    const subfolderName = urlParts[4];
    const fileName = urlParts[5];
 
    console.log("Bucket Name:", bucketName);
    console.log("Folder Name:", folderName);
    console.log("Subfolder Name:", subfolderName);
    console.log("File Name:", fileName);
 
    // Post the file URL to the '/textract' endpoint along with extracted parameters
    //change this to your url (we need to create .env and make it work)
    const postResponse: AxiosResponse = await axios.post(
      "https://s4vlc5ppv3.execute-api.us-east-1.amazonaws.com/textract",
      {
        bucketName,
        folderName,
        subfolderName,
        fileName,
      }
    );
 
    // Extracted text
    const responseData = postResponse.data;
    const extractedText = responseData.text;
    console.log("Extracted Text from the handler:", extractedText);
 
    // Construct the request payload to match the provided structure
    const requestBody = {
      body: {
        inputs:
          extractedText +
          "can you provide a summary about this file content, start the summary with This file is about and summarize it in 5 bullet points ",
        parameters: {
          max_new_tokens: 3000,
          top_p: 0.9,
          temperature: 0.2,
        },
      },
    };
 
    // If the response is successful (status code 200), make a POST request to the SageMaker endpoint
    if (postResponse.status === 200) {
      // Replace "Text" with the actual extracted text
      const endpoint =
        "https://d55gtzdu04.execute-api.us-east-1.amazonaws.com/dev-demo/sageMakerInvoke";
 
      try {
        // Make the POST request to the endpoint
        const response = await axios.post(endpoint, requestBody);
 
        // Log the response
        console.log("Response from endpoint:", response.data);
        // Now this needs to be saved in the database with the corresponding standard name/uni/fileURL
      } catch (error: any) {
        // Log any errors
        console.error("Error sending request:", error.message);
      }
    }
 
    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: responseData.message,
        extractedText: extractedText,
      }),
    };
  } catch (error: any) {
    // Log error and return response
    console.log("Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}