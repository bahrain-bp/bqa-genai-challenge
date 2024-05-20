import axios from "axios";

export async function invokeSageMaker(chunk: string) {
  const requestBody = {
    body: {
      inputs: chunk + " Can you provide a summary about this file content? Start the summary with 'This file is about' and summarize it in a small paragraph.",
      parameters: {
        max_new_tokens: 3500,
        top_p: 0.9,
        temperature: 0.2,
      },
    },
  };

  const endpoint = "https://d55gtzdu04.execute-api.us-east-1.amazonaws.com/dev-demo/sageMakerInvoke";

  try {
    // Make the POST request to the endpoint for each chunk
    const response = await axios.post(endpoint, requestBody);

    // Log the response
    console.log("Response from SageMaker endpoint:", response.data);

    // Return the response data
    return response.data;
  } catch (error: any) {
    // Log any errors
    console.error("Error sending request to SageMaker endpoint:", error.message);
    throw error;
  }
}
