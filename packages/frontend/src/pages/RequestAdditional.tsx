import React, { useState, useEffect } from 'react';

const Email: React.FC = () => {
  const [result, setResult] = useState('');

  const emailBody = `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>SES Missing/Incorrect Evidence Content</title>
      <style>
          body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 10px;
              box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          }
          .heading {
              font-size: 32px;
              font-weight: bold;
              color: #434343;
              margin-bottom: 20px;
          }
          .content {
              font-size: 18px;
              color: #9b9b9b;
              line-height: 1.5;
          }
          .signature {
              display: flex;
              align-items: center;
              margin-top: 20px;
          }
          .signature img {
              width: 40px;
              height: 40px;
              margin-right: 10px;
          }
          .signature-name {
              font-size: 16px;
              font-weight: bold;
              color: #434343;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="heading">Important Notice</div>
          <div class="content">
              <p>Dear recipient,</p>
              <p>We would like to inform you that your file "[file-name]" has been uploaded, but it appears to be incorrect as it does not contain the required keyword.</p>
              <p>Please take the necessary action to address this issue.</p>
              <p>Thank you for your attention.</p>
              <p>Sincerely,</p>
          </div>
          <div class="signature">
              <img src="images/image-1713611001551.png" alt="">
              <div class="signature-name">Maryam Kamashki | EduScribe</div>
          </div>
      </div>
  </body>
  </html>
  `;

  const sendEmail = async () => {
    const emailData = {
      userEmail: 'maryamkameshki02@gmail.com', // temporary email address
      subject: 'Test Email',
      body: emailBody
    };

    const apiUrl = `https://6fy734lqlc.execute-api.us-east-1.amazonaws.com/send-email`; // changed to my stage URL

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      const responseData = await response.json();
      if (responseData.result === 'OK') {
        setResult('Email sent successfully');
      } else {
        setResult('Error sending email');
      }
    } catch (error) {
      console.error('Network Error:', error);
      setResult('Error sending email');
    }
  };

  return (
    <div>
      <h1>Email Template</h1>
      <button onClick={sendEmail}>Send Email</button>
      {result && <p>{result}</p>}
    </div>
  );
};

export default Email;