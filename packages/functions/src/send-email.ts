import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as aws from 'aws-sdk';

export const sendEmail = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let { sourceEmail = '', userEmail = '', body = '', subject = '' } = {}; // fix error(Binding element 'userEmail' implicitly has an 'any' type.ts(7031) let userEmail: any) 
                                                        // by: initializing the variables to empty string.
  try {
    console.log(`Email: ${userEmail}, Subject: ${subject}, Message: ${body}`);

    const requestBody = JSON.parse(event.body || '{}');
    sourceEmail = requestBody.sourceEmail;
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

  console.log('source email:', sourceEmail);
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
      Source: sourceEmail,
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