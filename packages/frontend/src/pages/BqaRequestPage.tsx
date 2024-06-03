import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import React, { useEffect, useState } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { useTranslation } from 'react-i18next';
import { fetchUserAttributes } from 'aws-amplify/auth';



function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const BqaRequestPage: React.FC = () => {
 // const [/*users*/, setUsers] = useState<{ Username: string; Attributes: { Name: string; Value: string }[] }[]>([]);
 
  // state variables
  const [sourceEmail, setSourceEmail] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const subject = 'Additional Document Required';
  const [body, setBody] = useState('');
  const navigate = useNavigate();

  // const { t } = useTranslation(); // Hook to access translation functions
  const api = import.meta.env.VITE_API_URL;


  const query = useQuery();
  const name = query.get('name');
  
  const useUsername = () =>
    {
      const location = useLocation();
      const queryParams = new URLSearchParams(location.search);
      const username = queryParams.get('username');
      return username;
    }
  
    const username = useUsername();
    console.log('username:' + username);
  
  // getting user attribute
  const getAttributeValue = (attributes: { Name: string; Value: string }[], attributeName: string): string => {
    const attribute = attributes.find(attr => attr.Name === attributeName);
    return attribute ? attribute.Value : 'N/A'; // Returns 'N/A' if attribute not found
  };

  useEffect(() => {
    // getting current user email
    const getCurrentUserInfo = async () => {
      try {
        const attributes = fetchUserAttributes();
        setSourceEmail((await attributes)?.email ?? ''); // Provide a default value for setSourceEmail
        console.log("Source Email: " + (await attributes)?.email ?? ''); // email doesn't show in the log but is recognized
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    // getting university user email
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
              setUserEmail(filteredUsers[0].email); 
              console.log(`Email of ${name}: ${filteredUsers[0].email}`);
            } else {
                console.log(`No user found with the name: ${name}`);
                // setuserEmail(''); // Clear the email if no user is found
            }
         
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    getCurrentUserInfo();
    fetchUserInfo();
  }, [name]);

    // test before sending
    // console.log(`Email: ${userEmail}, Subject: Additional Document Required, Message: ${body}`);
    
  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    //SES part
    // Define the API URL

    try {

      // test before sending
      // console.log(`Email: ${userEmail}, Subject: Additional Document Required, Message: ${body}`);

      // Invoke lambda function to send email
      const response = await fetch(`${api}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sourceEmail,
          userEmail, // recipient
          subject,
          body
      })
      });

      // Get the response data
      const responseData = await response.json();

      if (responseData.result === 'OK') 
        {
          toast.success(`Request is successfully sent to ${userEmail}`, { position: 'top-right' });
          navigate(`/BqaDash2/${name}?username=${username}`, {
            state: {
              uniName: name
            }
          });
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
      
      <div
    className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark
                border-b border-stroke py-4 px-7 dark:border-strokedark" >
        
        <div className="dropdown-section "> 
        <label htmlFor="user"  className="block text-lg font-medium text-gray-700 dark:text-gray-300">Choose a user or a university:</label>
        <select id="user" name="user"
        disabled={true}
        className="w-full mt-1 px-1.5 py-1.5 rounded-md border border-gray-300 bg-gray focus:ring-primary focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:focus:border-primary dark:focus:ring-primary dark:text-gray-300"
        value={userEmail}>

         <option value={userEmail}>{userEmail}</option>
        </select>
        </div>
        
        <div className="subject-section mt-6">
          <label htmlFor="subject" className="block text-lg font-medium text-gray-700 dark:text-gray-300">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={subject}
            disabled={true}
            className="w-full rounded border border-stroke bg-gray py-3 px-4.5  text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
            placeholder="Write your subject here"
          />
         
        </div>

       <div className="message-section mt-6 " >
         <label htmlFor="message" className="block text-lg font-medium text-gray-700 dark:text-gray-300">What do you want to include in the body?</label>
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
      
      
      </div>
    </DefaultLayout>
  );
};

export default BqaRequestPage;