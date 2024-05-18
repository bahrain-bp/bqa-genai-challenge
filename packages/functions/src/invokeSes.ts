// Function to invoke SES to send an email
import { fetchUserAttributes } from 'aws-amplify/auth';
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

export const invokeSendEmailLambda = async (): Promise<any> => {

    // sender email address
    const sourceEmail = 'maryamkameshki02@gmail.com';

    // getting the current user's email
    // const user = await fetchUserAttributes();
    // const userEmail = user?.email;
    // console.log("userEmail: ", userEmail);

    // receiver email address
    const userEmail = 'maryamalsaad20@gmail.com';

    // email subject
    const subject = 'Test Email';

    // file name that was uploaded
    const fileName = 'test.txt';

    // message to be sent
    const body = `This is a test email. ${fileName}`; 

    // note: current user and source email both need to be verified in SES to send the email

    // parameters for the send-email Lambda function
    const params = {
        // i'm suspecting that the lambda function name is wrong but that is what i found in the management console 
        // when i searched for the function "sendEmail" (i wanted the function name to be "sendEmail" from send-email.ts file)
        
        FunctionName: 'imira-codecatalyst-sst-ap-signinAPILambdaPOSTsende-4P8UiYP24Y1g', // Name of the sendEmail Lambda function
        InvocationType: 'RequestResponse', // Synchronous invocation
        Payload: JSON.stringify({
            sourceEmail: sourceEmail,
            userEmail: userEmail,
            subject: subject,
            body: body
        })
    };

    try {
        // invoke the Lambda function and pass the parameters
        const response = await lambda.invoke(params).promise();
        console.log(response);

        // check if the response is successful
        if(response.StatusCode !== 200){
            throw new Error('Failed to get response from lambda function')
          }

        // return the response
        return JSON.parse(response.Payload);

    } catch (error) {
        console.error(error);
        throw error;
    }
};