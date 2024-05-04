import React, { useState } from 'react';

const Email: React.FC = () => {
  const [result, setResult] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [document, setDocument] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'universityName') {
      setUniversityName(value);
    } else if (name === 'document') {
      setDocument(value);
    }
  };

  const sendEmail = async () => {
    const emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
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
                  <p>Dear recipient from University of Bahrain,</p> <!-- ${universityName} -->
                  <p>I am writing to request an additional document from you.</p>
                  <p>Would you be able to provide the following document at your earliest convenience?</p>
                  <p>${document}</p>
                  <p>Thank you for your cooperation.</p>
                  <p>Sincerely,</p>
              </div>
              <div class="signature">
                  <div class="signature-name">BQA Reviewer</div>
              </div>
          </div>
      </body>
      </html>
    `;

    const emailData = {
      userEmail: 'maryamkameshki02@gmail.com', // temporary email address
      subject: 'Additional Document Required',
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
    <style>
      {`
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        label {
          font-weight: bold;
        }
        input[type="email"],
        textarea {
          width: 100%;
          padding: 10px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-sizing: border-box;
        }
        button {
          background-color: #4caf50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background-color: #45a049;
        }
        p {
          margin-top: 10px;
        }
        .result {
          text-align: center;
        }
        .title{
          text-align: center;
          text-transform: uppercase;
          font-size: 16pt;
        }
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
        .signature-name {
            font-size: 16px;
            font-weight: bold;
            color: #434343;
        }
      `}
    </style>
    <div className="container">
      <h1 className='title'>Email Request Form</h1>
      <div>
        <label htmlFor="universityName">University Name:</label><br />
        <input
          type="email"
          id="universityName"
          name="universityName"
          value={universityName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="document">What additional document do you want to request?</label><br />
        <textarea
          id="document"
          name="document"
          value={document}
          onChange={handleChange}
          rows={5}
          required
        ></textarea>
      </div>
      <button onClick={sendEmail}>Send Request</button>
      <p className='result'>{result}</p>
    </div>

    <div className='container'>
      <h1>Sample Email That will be sent:</h1>
      <div className='container'>
        <div className="heading">Important Notice</div>
          <div className="content">
              <p>Dear recipient from {universityName},</p>
              <p>I am writing to request an additional document from you.</p>
              <p>Would you be able to provide the following document at your earliest convenience?</p>
              <p>{document}</p>
              <p>Thank you for your cooperation.</p>
              <p>Sincerely,</p>
          </div>
          <div className="signature">
              <div className="signature-name">BQA Reviewer</div>
          </div>
      </div>
    </div>
  </div>  
  );
};

export default Email;