import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,

} from "@aws-sdk/client-cognito-identity-provider";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-east-1",
});

const userPoolId = "us-east-1_PraHctOMo";

export const createUserInCognito: APIGatewayProxyHandlerV2 = async (
  event: any
) => {
  const { email, tempPassword,name } = JSON.parse(event.body);

  try {
    const command = new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: email,
      TemporaryPassword: tempPassword,
     
      UserAttributes: [
        {
          Name: "email",
          Value: email
        },
        {
          Name: "email_verified",
          Value: "true" // Automatically verify the email
        },
        {
           Name: "name", 
           Value: name 
          },
            
        
      ],
      //MessageAction: 'SUPPRESS', // This will change the force change password to confirmed.
      //IT DOES NOT WORK
    });

    const response = await cognitoClient.send(command);



//This will let the change password be set to confirmed 

    const setPass=new AdminSetUserPasswordCommand({
      UserPoolId: userPoolId,
      Username: email,
      Password: tempPassword,
      Permanent: true

    });
    await cognitoClient.send(setPass);





    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User created successfully" }),
    };
  } catch (error) {
    console.error("Error creating user", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error creating user" }),
    };
  }
};