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
  const [users, setUsers] = useState<{ Username: string; Attributes: { Name: string; Value: string }[] }[]>([]);
 


 const [selectedEmail, setSelectedEmail] = useState<string>('');
  
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const query = useQuery();


  useEffect(() => {
    const email = query.get('email');
    setSelectedEmail(email ?? '');

    const fetchCognitoUsers = async () => {
      try {
        const response = await fetch('https://66xzg471hh.execute-api.us-east-1.amazonaws.com/getUsers');
        const data = await response.json();
        if (response.ok) {
                  // Filter out users where the 'name' attribute is 'BQA reviewer'
        const filteredUsers = data.filter((user: { Attributes: { Name: string; Value: string; }[]; }) => {
          const nameValue = getAttributeValue(user.Attributes, 'name');
          return nameValue !== 'BQA Reviewer';
        });
          console.log(data); // Users data
          setUsers(filteredUsers); // Update the users state with the fetched data
        } else {
          console.error('Error fetching users:', data.error);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchCognitoUsers(); // Call the fetchCognitoUsers function
  }, []);
    // Function to find attribute value by name
    const getAttributeValue = (attributes: { Name: string; Value: string }[], attributeName: string): string => {
      const attribute = attributes.find(attr => attr.Name === attributeName);
      return attribute ? attribute.Value : 'N/A'; // Returns 'N/A' if attribute not found
    };
    
      const handleSubmit = () => {
    // Example of what you might do, customize as needed:
    console.log(`Email: ${selectedEmail}, Subject: ${subject}, Message: ${message}`);
    toast.success(`Request is successfully sent to ${selectedEmail}`, { position: 'top-right' });
    //toast.error('Failed to send the request.', { position: 'top-right' });

    // Here you would typically send this data to a backend API 
    //SES part
  };
    

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Bqa Reviewer Request Additional Documents" />
      
      <div
    className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark
                border-b border-stroke py-4 px-7 dark:border-strokedark" >
        
        <div className="dropdown-section "> 
        <label htmlFor="user"  className="block text-lg font-medium text-gray-700 dark:text-gray-300">Choose a user or a university:</label>
        <select id="user" name="user"
        disabled={true}
         
      className="w-full mt-1 px-1.5 py-1.5 rounded-md border border-gray-300 bg-gray focus:ring-primary focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:focus:border-primary dark:focus:ring-primary dark:text-gray-300"
      value={selectedEmail}>

         <option value={selectedEmail}>{selectedEmail}</option>
        </select>
        </div>
        
        <div className="subject-section mt-6">
          <label htmlFor="subject" className="block text-lg font-medium text-gray-700 dark:text-gray-300">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded border border-stroke bg-gray py-3 px-4.5  text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
            placeholder="Write your subject here"
          />
         
        </div>

       <div className="message-section mt-6 " >
         <label htmlFor="message" className="block text-lg font-medium text-gray-700 dark:text-gray-300">Message:</label>
         <textarea
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
      
      
      </div>
    </DefaultLayout>
  );
};

export default BqaRequestPage;