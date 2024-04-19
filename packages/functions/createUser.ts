import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-east-1",
});

const userPoolId = "us-east-1_PraHctOMo";

export const createUserInCognito: APIGatewayProxyHandlerV2 = async (
  event: any
) => {
  const { email, tempPassword } = JSON.parse(event.body);

  try {
    const command = new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: email,
      TemporaryPassword: tempPassword,
    });

    const response = await cognitoClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User created successfully" }),
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error creating user" }),
    };
  }
};
