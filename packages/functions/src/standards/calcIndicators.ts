import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import fetch from "node-fetch";
export const main: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    // Define the API endpoint URL (replace with your actual API endpoint)
    const apiUrl = "https://iklcb83307.execute-api.us-east-1.amazonaws.com/standards";

    // Use fetch to send a GET request to the API
    const response = await fetch(apiUrl);

    // Check for successful response (status code 200)
    if (!response.ok) {
      console.error(`Error fetching standards from API: ${response.status}`);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error retrieving standards" }),
      };
    }

    // Parse the response body (assuming JSON format)
    const standards = await response.json() as { indicators: string[] }[];

    // Handle empty response (optional)
  

    // Calculate total number of indicators across all standards
    const totalIndicators = standards.reduce((acc: number, standard: { indicators: string[] }) => {
      const indicators = standard.indicators || [];
      return acc + indicators.length;
    }, 0);

    return {
      statusCode: 200,
      body: JSON.stringify({ totalIndicators }),
    };
  } catch (error) {
    console.error("Error fetching standards or calculating indicators:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error retrieving or calculating indicators" }),
    };
  }
};
