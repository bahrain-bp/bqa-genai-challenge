import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import React, { useEffect, useState } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import { useLocation } from 'react-router-dom';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const BqaRequestPage: React.FC = () => {
 // const [/*users*/, setUsers] = useState<{ Username: string; Attributes: { Name: string; Value: string }[] }[]>([]);


 const [selectedEmail, setSelectedEmail] = useState<string>('');
 const [message, setMessage] = useState<string>('');
 const [result, setResult] = useState('');

  const query = useQuery();


  useEffect(() => {
    const email = query.get('email');
    setSelectedEmail(email ?? '');

    // const fetchCognitoUsers = async () => {
    //   try {
    //     const response = await fetch('https://u1oaj2omi2.execute-api.us-east-1.amazonaws.com/getUsers');
    //     const data = await response.json();
    //     if (response.ok) {
    //               // Filter out users where the 'name' attribute is 'BQA reviewer'
    //     const filteredUsers = data.filter((user: { Attributes: { Name: string; Value: string; }[]; }) => {
    //       const nameValue = getAttributeValue(user.Attributes, 'name');
    //       return nameValue !== 'BQA Reviewer';
    //     });
    //       console.log(data); // Users data
    //       setUsers(filteredUsers); // Update the users state with the fetched data
    //     } else {
    //       console.error('Error fetching users:', data.error);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching users:', error);
    //   }
    // };

  //   fetchCognitoUsers(); // Call the fetchCognitoUsers function
}, 
  []);
    // Function to find attribute value by name
    // const getAttributeValue = (attributes: { Name: string; Value: string }[], attributeName: string): string => {
    //   const attribute = attributes.find(attr => attr.Name === attributeName);
    //   return attribute ? attribute.Value : 'N/A'; // Returns 'N/A' if attribute not found
    // };
    
    const handleChange = (e: any) => {
      const { name, value } = e.target;
      if (name === 'user') {
        const email = query.get('email');
        setSelectedEmail(email ?? '');
      } else if (name === 'document') {
        setMessage(value);
      }
    };

    // Function to handle form submission
      const handleSubmit = async () => {
    // Example of what you might do, customize as needed:
    console.log(`Email: ${selectedEmail}, Subject: Additional Document Required, Message: ${message}`);
    toast.success(`Request is successfully sent to ${selectedEmail}`, { position: 'top-right' });
    //toast.error('Failed to send the request.', { position: 'top-right' });

    // Here you would typically send this data to a backend API 
    //SES part

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
                  <p>Dear recipient,</p>
                  <p>I am writing to request an additional document from you.</p>
                  <p>Would you be able to provide the following document at your earliest convenience?</p>
                  <p>${message}</p>
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
      userEmail: `${selectedEmail}`,
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
    <DefaultLayout>
      <Breadcrumb pageName="Bqa Reviewer Request Additional Documents" />
      
      <div
    className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark
                border-b border-stroke py-4 px-7 dark:border-strokedark" >
        
        <div className="dropdown-section "> 
        <label htmlFor="user"  className="block text-lg font-medium text-gray-700 dark:text-gray-300">Choose a user or a university:</label>
        <select onChange={handleChange} id="user" name="user" 
        disabled={true}
         
      className="w-full mt-1 px-1.5 py-1.5 rounded-md border border-gray-300 bg-gray focus:ring-primary focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:focus:border-primary dark:focus:ring-primary dark:text-gray-300"
      value={selectedEmail}>

         <option value={selectedEmail}>{selectedEmail}</option>
        </select>
        </div>

       <div className="message-section mt-6 " >
         <label htmlFor="message" className="block text-lg font-medium text-gray-700 dark:text-gray-300">What additional document do you want to request?</label>
         <textarea
          id="message"
          name="message"
          value={message}
          onChange={handleChange}
          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
          placeholder="Write your message here"
         ></textarea>
      </div>

      <div className="flex justify-end py-4">
    <button
      onClick={handleSubmit}
      className="send-request-btn px-5 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-opacity-50"
    >
      Send Request
    </button>
  </div>
  <div className="result">
    {result && <p>{result}</p>}
  </div>   
      </div>
    </DefaultLayout>
  );
};

export default BqaRequestPage;