import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as aws from 'aws-sdk';

export const sendEmail = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let { userEmail = '', body = '', subject = '' } = {}; // fix error(Binding element 'userEmail' implicitly has an 'any' type.ts(7031) let userEmail: any) 
                                                        // by: initializing the variables to empty string.
  try {
    const requestBody = JSON.parse(event.body || '{}');
    userEmail = requestBody.userEmail;
    body = requestBody.body;
    subject = requestBody.subject;
  } catch (error) {
    console.error('Invalid JSON payload:', event.body);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON payload' }),
    };
  }

  const source = "ayshacheema469@gmail.com"; // sender email
  console.log('source email:', source);
  console.log("userEmail:", userEmail);
  
  let data = {
    result: 'ERROR',
  };

  try {
    const ses = new aws.SES();

    await ses.sendEmail({
      Destination: {
        ToAddresses: [userEmail],
      },
      Source: source,
      Message: {
        Subject: {
          Data: subject || '',
        },
        Body: {
          Html: {
            Data: body || '',
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