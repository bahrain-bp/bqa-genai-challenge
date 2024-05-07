import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import './PredefinedTemplate.css'; // Importing CSS file
//import { aws_cognito as cognito } from 'aws-cdk-lib';
//import { env } from 'process';
//import { signUp, confirmSignUp } from 'aws-amplify/auth';
//import { CognitoIdentityProviderClient, AdminCreateUserCommand } from "@aws-sdk/client-cognito-identity-provider"; // ES Modules import
// import * as AWS from 'aws-sdk';
// import {
//   CognitoIdentityProviderClient,
// } from '@aws-sdk/client-cognito-identity-provider';


// Add authenticator so only admin can create an email and
// password
//import { Authenticator } from '@aws-amplify/ui-react';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify
// Set the AWS Region

const generateTemporaryPassword = () => {
  const numbers = '0123456789';
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const specialCharacters = '!@#$%^&*()_+';
  const base =
    lowerCaseLetters + upperCaseLetters + numbers + specialCharacters;

  let password = '';
  // Ensure at least one character from each set
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password +=
    lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)];
  password +=
    upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)];
  password +=
    specialCharacters[Math.floor(Math.random() * specialCharacters.length)];

  // Fill the rest of the password length to meet the minimum required (e.g., 8 characters)
  for (let i = password.length; i < 12; i++) {
    password += base[Math.floor(Math.random() * base.length)];
  }

  // Shuffle the password to ensure randomness (Optional)
  password = password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');

  return password;
};

const AddUni = () => {
  
  // const cognitoPoolId = 'us-east-1_PraHctOMo';
  // const cognitoClient = new CognitoIdentityProviderClient({
  //   region: 'us-east-1',
  // });

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [logo, setLogo] = useState<File | null>(null);

  
  const getMimeType = (filename:any) => {
    const extension = filename.split('.').pop();
    switch (extension.toLowerCase()) {
        case 'jpg': return 'image/jpg';
        case 'jpeg': return 'image/jpeg';
        case 'png': return 'image/png';
        default: return 'application/octet-stream'; // Default MIME type
    }
};
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setLogo(file);
  };
 
  async function handleAddEmail() {
    if (!email || !name || !logo) {
      toast.error('Please fill all the fields.');
      return;
    }
    const tempPassword = generateTemporaryPassword(); // Generate a compliant temporary password
   
    //First uploa the

    try {
      //const logoUrl = await uploadLogo(logo); // Get the URL of the uploaded logo
      await createUser(email, tempPassword, name); //
      await uploadLogo(logo, name); //

      toast.success('User and logo added successfully!');
  } catch (error) {
      console.error('Error:', error);
      toast.error('Error, please try again.');
  }
}


    const createUser = async (email: string, tempPassword: string, name: string) => {
      const url =
        'https://66xzg471hh.execute-api.us-east-1.amazonaws.com/createUser'; // This will be replaced with the main api
        //66xzg471hh mine ----- prod u1oaj2omi2
      const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, tempPassword , name}),
      };

      try {
        const response = await fetch(url, requestOptions);
        if (response.ok) {
          const data = await response.json();
          console.log('User created successfully:', data);
          // Handle success (e.g., display success message to the user)
        } else {
          const errorData = await response.json();
          console.error('Failed to create user:', errorData);
          // Handle failure (e.g., display error message to the user)
        }
      } catch (error) {
        console.error('Error creating user:', error);
        // Handle error (e.g., display error message to the user)
      }
    };



    

    // try {
    //   createUser(email, tempPassword,name);

    //   console.log('Admin create user successful');
    //   toast.success('Verification email sent to ' + email);
    // } catch (error) {
    //   console.error('Error creating user:', error);
    //   toast.error('Failed to create user: ');
    // }


   //end of upload
   //trying the upload logo
   const uploadLogo = async ( logo:File , name:string) => {
    const mimeType = getMimeType(File.name);
if (!logo) {
    toast.error('Please select a logo to upload.');
    return;
  }
    const url =
      'https://66xzg471hh.execute-api.us-east-1.amazonaws.com/uploadLogo'; // This will be replaced with the main api
    /////
     const formData = new FormData();
        formData.append('logo', logo, logo.name); // Append the file to FormData
        //formData.append('name', name); // Optionally send email or other fields
    
      const requestOptions: RequestInit = {
      method: 'POST',
      body:formData,
      headers: {
        'file-name': logo.name,
        'bucket-name':'uni-artifacts',
        'folder-name':name,
        'subfolder-name':'logos',
        'Content-Type': 'image/png'
      },
     // body: JSON.stringify({ logo }),
    };

    // try {
    //   const response = await fetch(url, requestOptions);
    //   if (response.ok) {
    //     const data = await response.json();
    //     console.log('Logo uploaded successfully', data);
    //     // Handle success (e.g., display success message to the user)
    //   } else {
    //     const errorData = await response.json();
    //     console.error('Failed to upload logo:', errorData);
    //     // Handle failure (e.g., display error message to the user)
    //   }
    // } catch (error) {
    //   console.error('Error Uploading Logo:', error);
    //   // Handle error (e.g., display error message to the user)
    // }
  
    try {
      const response = await fetch(url, requestOptions);
      if (response.ok) {
        const data = await response.json();
        console.log('Logo uploaded successfully:', data);
        // Handle success (e.g., display success message to the user)
      } else {
        const errorData = await response.json();
        console.error('Failed to upload logo:', errorData);
        // Handle failure (e.g., display error message to the user)
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      // Handle error (e.g., display error message to the user)
    }


  };

   


  

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add University Details" />
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">



      <div className="mb-4">

      <label htmlFor="universityEmail" className="block text-m font-medium text-gray-700">University Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"

          />
        </div>

        <div className="mb-4">
          <label htmlFor="universityName" className="block text-m font-medium text-gray-700">University Name:</label>
          <input
            id="universityName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="University Name"
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"

          />
        </div>
        <div className="mb-4">
          <label htmlFor="logo" className="block text-m font-medium text-gray-700">University Logo:</label>
          <input 
          id="logo" type="file" 
          onChange={handleFileChange} 
          className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"

          />
        </div>

        <div className="mb-4">

        <button onClick={handleAddEmail}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">

          Add Email</button>
     </div>
     
     </div>
      </div>
    </DefaultLayout>
  );


};

export default AddUni;
