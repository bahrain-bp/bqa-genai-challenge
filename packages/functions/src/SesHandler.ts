import { Handler, APIGatewayEvent } from 'aws-lambda';
import * as aws from 'aws-sdk';
import * as nodemailer from 'nodemailer';

interface EventBody {
    senderEmail: string;
    receiverEmail: string;
    message: string;
    date: string;
    fileName: string;
}

export const handler: Handler = async (event: APIGatewayEvent) => {
    try {
        const { senderEmail, receiverEmail, message, date, fileName } = JSON.parse(event.body || '{}') as EventBody;

        const transporter = nodemailer.createTransport({
            SES: new aws.SES({
                apiVersion: '2010-12-01',
                region: 'us-east-1'
            })
        });

        const text = "Attached A file Here";

        const emailProps = await transporter.sendMail({
            from: senderEmail,
            to: receiverEmail,
            subject: date,
            text: text,
            html: `<p>${text}</p>`,
            attachments: [
                {
                    filename: "Test_File.pdf",
                    content: "Hello World"
                }
            ]
        });

        return {
            statusCode: 200,
            body: JSON.stringify(emailProps)
        };
    } catch (error: any) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};