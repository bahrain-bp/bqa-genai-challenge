// for testing purposes only

import axios from 'axios';

export const invokeSendEmailLambda = async (): Promise<any> => {
    try {
        // Prepare email parameters
        const sourceEmail = 'noreplyeduscribeai@gmail.com'; // sender email address
        const userEmail = 'maryamkameshki02@gmail.com'; // receiver email address replace this with the email of university that uploaded the file
        const subject = 'Processing Complete';
        const fileName = 'test.txt'; // file name that was uploaded
        const fileURL = 'https://s3.amazonaws.com/bucket/test.txt'; // URL of the file that was processed by the Lambda function
        const body = `The processing of your file '${fileName}' is complete. You can access it at ${fileURL}.`;

        // Invoke the email sending Lambda function
        const response = await axios.post('https://u1oaj2omi2.execute-api.us-east-1.amazonaws.com/send-email', {
            sourceEmail,
            userEmail, // recipient
            subject,
            body
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(response);

        // Check if the response is successful
        if (response.status !== 200) {
            console.log('Failed to get response from lambda function');
            throw new Error('Failed to get response from lambda function');
        }

        // Return the response data
        return response.data;

    } catch (error) {
        console.error(error);
        throw error;
    }
};