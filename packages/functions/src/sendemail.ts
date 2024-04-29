import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
const aws = require('aws-sdk');
 
export const sendEmail = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { userEmail, body, subject } = JSON.parse(event.body || '{}');
  const source = process.env.SES_EMAIL;
  console.log('source email:', source);
console.log("userEmail:", userEmail);
  let data = {
    result: 'ERROR',
  };
 
  try {
    const ses = new aws.SES();
 
    const arrayEmail = [userEmail]; // Simplifying the array creation
 
    await ses.sendEmail({
      Destination: {
        ToAddresses: arrayEmail,
      },
      Source: source,
      Message: {
        Subject: {
          Data: subject || '', // Ensuring that subject and body are non-null
        },
        Body: {
          Html: {
            Data: body || '', // Ensuring that subject and body are non-null
          },
        },
      },
    }).promise();
 
    data.result = 'OK';
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
 
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}; 