import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import React, { useEffect, useState } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import { useLocation } from 'react-router-dom';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { useTranslation } from 'react-i18next';


function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const BqaRequestPage: React.FC = () => {
 // const [/*users*/, setUsers] = useState<{ Username: string; Attributes: { Name: string; Value: string }[] }[]>([]);
 
 const [selectedEmail, setSelectedEmail] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  // const { t } = useTranslation(); // Hook to access translation functions
  const api = import.meta.env.VITE_API_URL;

  //const [user, setUsers] = useState<{ Username: string; Attributes: { Name: string; Value: string }[] }[]>([]);

  const query = useQuery();
  const name = query.get('name');
  
  // const [currentEmail, setCurrentEmail] = useState('');
  const getAttributeValue = (attributes: { Name: string; Value: string }[], attributeName: string): string => {
    const attribute = attributes.find(attr => attr.Name === attributeName);
    return attribute ? attribute.Value : 'N/A'; // Returns 'N/A' if attribute not found
  };
  useEffect(() => {
    const fetchUserInfo = async () => {

      if (!name) {
        console.error('No name provided in query parameters');
        return;
      }
      try {
            //  console.log("Uni name: " + name);

        // Assuming fetchUserAttributes takes a name parameter and fetches the corresponding user attributes
        const response = await fetch(`${api}/getUsers`);

        // const response = await fetch(`https://u1oaj2omi2.execute-api.us-east-1.amazonaws.com/getUsers`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
       
          const filteredUsers = data.filter((user: { Attributes: { Name: string; Value: string; }[]; }) => {
            const nameValue = getAttributeValue(user.Attributes, 'name');
            return nameValue === name;
          }).map((user: { Attributes: { Name: string; Value: string; }[]; }) => ({
            name: getAttributeValue(user.Attributes, 'name'), // Extract name
            email: getAttributeValue(user.Attributes, 'email') // Extract email

        }   ));

         // Check if there's a matching user and set their email
            if (filteredUsers.length > 0) {
              setSelectedEmail(filteredUsers[0].email); 
              console.log(`Email of the user ${name}: ${filteredUsers[0].email}`);
            } else {
                console.log(`No user found with the name: ${name}`);
                setSelectedEmail(''); // Clear the email if no user is found
            }

            
         
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, [name]);

  
    
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
          <label htmlFor="user"  className="block text-lg font-medium text-gray-700 dark:text-gray-300">You are sending to:</label>
            <select id="user" name="user" 
            disabled={true}
            className="w-full mt-1 px-1.5 py-1.5 rounded-md border border-gray-300 bg-gray focus:ring-primary focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:focus:border-primary dark:focus:ring-primary dark:text-gray-300"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}>
                <option value={userEmail}>{userEmail}</option>
            </select>     
          </div>

         <div className="message-section mt-6 " >
           <label htmlFor="message" className="block text-lg font-medium text-gray-700 dark:text-gray-300">What additional document do you want to request?</label>
           <textarea
            id="message"
            name="message"
            value={body}
            onChange={(e) => setBody(e.target.value)}
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