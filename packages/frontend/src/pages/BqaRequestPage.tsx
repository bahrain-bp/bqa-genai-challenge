import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import React, { useEffect, useState } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';

// Function to get the query parameters from the URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const BqaRequestPage: React.FC = () => {

  const [userEmail, setUserEmail] = useState(''); // Accessing email from location state
  const  subject = 'Additional Document Required'; // variable to store the subject of the email
  const [body, setBody] = useState(''); // state to store the body of the email

  // Get the query parameters from the URL  
   const query = useQuery();

  // Function to retrieve query parameters
  useEffect(() => {
        const email = query.get('email');
        setUserEmail(email ?? '');}, []);

  // Function to handle form submission
  const handleSubmit = async () => {

        // Error Checking:
        // console.log(`Email: ${userEmail}, Subject: Additional Document Required, Message: ${body}`);

    // Define the API URL 
    const apiUrl = `https://y68sgxxozi.execute-api.us-east-1.amazonaws.com/send-email`; // changed to my stage URL

    try {
      // Invoke lambda function to send email
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([
          userEmail, // recipient
          subject,
          body
        ])
      });

      // Get the response data
      const responseData = await response.json();

      if (responseData.result === 'OK') 
        {
          toast.success(`Request is successfully sent to ${userEmail}`, { position: 'top-right' });
        } else {
          toast.error('Failed to send the request.', { position: 'top-right' });
        }

    } catch (error) {
      console.error('Network Error:', error);
      toast.error('Error Catched: Failed to send the request.', { position: 'top-right' });
    }
  };   

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Bqa Reviewer Request Additional Documents" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark border-b border-stroke py-4 px-7 dark:border-strokedark">
        
        {/* Display User Email */}
        <div className="dropdown-section">
          <label htmlFor="user" className="block text-lg font-medium text-gray-700 dark:text-gray-300">You are sending to:</label>
          <select
            id="user"
            name="user"
            disabled={true}
            value={userEmail}
            className="w-full mt-1 px-1.5 py-1.5 rounded-md border border-gray-300 bg-gray focus:ring-primary focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:focus:border-primary dark:focus:ring-primary dark:text-gray-300">
          </select>
        </div>

        {/* Ask User to Input message */}
        <div className="message-section mt-6 " >
          <label htmlFor="message" className="block text-lg font-medium text-gray-700 dark:text-gray-300">What additional document do you want to request?</label>
            <textarea
             id="message"
             name="message"
             value={body}
             onChange={(e) => setBody(e.target.value)}
             className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
             placeholder="Write your message here">
            </textarea>
        </div>

        {/* Button to Send Request */}
        <div className="flex justify-end py-4">
          <button
            onClick={handleSubmit}
            className="send-request-btn px-5 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-opacity-50">
            Send Request
          </button>
        </div>

      </div>
      </DefaultLayout>
    );
  };

export default BqaRequestPage;