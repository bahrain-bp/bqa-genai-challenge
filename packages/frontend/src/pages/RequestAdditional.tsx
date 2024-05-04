import React, { useState } from 'react';

const Email: React.FC = () => {
  const [result, setResult] = useState('');
  const [universityEmail, setUniversityEmail] = useState('');
  const [body, setBody] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'universityEmail') {
      setUniversityEmail(value);
    } else if (name === 'body') {
      setBody(value);
    }
  };

  const sendEmail = async () => {
    const emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Additional Document Required</title>
          <style>
              /* Your CSS styles */
          </style>
      </head>
      <body>
          <div class="container">
              <div class="heading">Important Notice</div>
              <div class="content">
                  <p>Dear ${universityEmail},</p>
                  <p>${body}</p>
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
      `}
    </style>
    <div className="container">
      <h1 className='title'>Email Request Form</h1>
      <div>
        <label htmlFor="universityEmail">University Email:</label><br />
        <input
          type="email"
          id="universityEmail"
          name="universityEmail"
          value={universityEmail}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="body">What additional document do you want to request?</label><br />
        <textarea
          id="body"
          name="body"
          value={body}
          onChange={handleChange}
          rows={5}
          required
        ></textarea>
      </div>
      <button onClick={sendEmail}>Send Request</button>
      <p className='result'>{result}</p>
    </div>
  </div>  
  );
};

export default Email;