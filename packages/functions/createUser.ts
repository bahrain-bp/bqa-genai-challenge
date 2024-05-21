import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  ListUsersCommand,
  ListUsersCommandOutput,

} from "@aws-sdk/client-cognito-identity-provider";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import * as uuid from "uuid";
import axios from "axios";


const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-east-1",
});
//const apiURL = import.meta.env.VITE_API_URL;


const userPoolId = "us-east-1_PraHctOMo";
const dynamoDb = new DynamoDB.DocumentClient();

export const createUserInCognito: APIGatewayProxyHandlerV2 = async (
  event: any
) => {
  const { email, tempPassword,name } = JSON.parse(event.body);

  try {
    const uniId = uuid.v4();


   // Check if email already exists in Cognito
   const emailCheckParams = {
    UserPoolId: userPoolId,
    Filter: `email = "${email}"`,
  };
  const emailCheckResponse: ListUsersCommandOutput = await cognitoClient.send(new ListUsersCommand(emailCheckParams));
  if (emailCheckResponse.Users && emailCheckResponse.Users.length > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Email already exists" }),
    };
  }





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

    const universityData = {
      name:  name, // Replace with the actual university name
      // Add other necessary attributes here
  };

      // Add the user to the DynamoDB table -- use put request on /universities
      // Define the POST request function
const createUniversity = async () => {
  try { //${apiURL}
      const response = await axios.post(`https://u1oaj2omi2.execute-api.us-east-1.amazonaws.com/addUniDB`, universityData);
      console.log('University created:', response.data);
  } catch (error) {
      console.error('Error creating university:', error);
  }
};

await createUniversity();

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