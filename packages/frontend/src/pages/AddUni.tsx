import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import './PredefinedTemplate.css'; // Importing CSS file
import { aws_cognito as cognito } from 'aws-cdk-lib';
import { env } from 'process';
//import { signUp, confirmSignUp } from 'aws-amplify/auth';
//import { CognitoIdentityProviderClient, AdminCreateUserCommand } from "@aws-sdk/client-cognito-identity-provider"; // ES Modules import
import * as AWS from 'aws-sdk';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminAddUserToGroupCommand
} from '@aws-sdk/client-cognito-identity-provider';


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
  const cognitoPoolId = 'us-east-1_PraHctOMo';
  const cognitoClient = new CognitoIdentityProviderClient({
    region: 'us-east-1',
  });

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [logo, setLogo] = useState<File | null>(null);

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
    // const params: AWS.CognitoIdentityServiceProvider.AdminCreateUserRequest = {
    //   UserPoolId: cognitoPoolId, // Replace with your User Pool ID

    //   Username: email,
    //   TemporaryPassword: tempPassword,
    //   UserAttributes: [
    //     {
    //       Name: 'email',
    //       Value: email,
    //     },
    //     {
    //       Name: 'email_verified',
    //       Value: 'true',
    //     },
    //   ],
    //   // MessageAction: 'RESEND', // Optionally, uncomment this line if needed
    //   DesiredDeliveryMediums: ['EMAIL'],
    // };
    const createUser = async (email: string, tempPassword: string, name: string) => {
      const url =
        'https://66xzg471hh.execute-api.us-east-1.amazonaws.com/createUser'; // This will be replaced with the main api
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

    try {
      createUser(email, tempPassword,name);

      console.log('Admin create user successful');
      toast.success('Verification email sent to ' + email);
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user: ');
    }


    // trying the upload logo
    const uploadLogo = async ( logo:File ) => {
      const url =
        'https://66xzg471hh.execute-api.us-east-1.amazonaws.com/uploadS3'; // This will be replaced with the main api
      /////
       const formData = new FormData();
          formData.append('logo', logo, logo.name); // Append the file to FormData
          //formData.append('name', name); // Optionally send email or other fields
      
        const requestOptions: RequestInit = {
        method: 'POST',
        body:formData,
        headers: {
          'file-name': 'logo',
          'bucket-name':'uni-artifacts',
          'folder-name':'bahrainPolytechnic'
        },
       // body: JSON.stringify({ logo }),
      };

      try {
        const response = await fetch(url, requestOptions);
        if (response.ok) {
          const data = await response.json();
          console.log('Logo uploaded successfully', data);
          // Handle success (e.g., display success message to the user)
        } else {
          const errorData = await response.json();
          console.error('Failed to upload logo:', errorData);
          // Handle failure (e.g., display error message to the user)
        }
      } catch (error) {
        console.error('Error Uploading Logo:', error);
        // Handle error (e.g., display error message to the user)
      }
    }; //end of upload


    
    try {
      await uploadLogo(logo);
      toast.success('Logo uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed, please try again.');
    }
  };


  

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add University" />
      <div className="container mx-auto px-4 py-8">
      <h1>Add University Details</h1>

      <div>
          <label htmlFor="email">University Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>

         <div>
          <label htmlFor="universityName">University Name:</label>
          <input
            id="universityName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="University Name"
          />
        </div>
        <div>
          <label htmlFor="logo">University Logo:</label>
          <input 
          id="logo" type="file" 
          onChange={handleFileChange} />
        </div>

        <button onClick={handleAddEmail}>Add Email</button>
      </div>
    </DefaultLayout>
  );


};

export default AddUni;
