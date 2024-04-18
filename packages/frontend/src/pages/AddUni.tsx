import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import './PredefinedTemplate.css'; // Importing CSS file
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import { CognitoIdentityProviderClient, AdminCreateUserCommand } from "@aws-sdk/client-cognito-identity-provider"; // ES Modules import
import * as AWS from "aws-sdk";


import { env } from 'process';
// Add authenticator so only admin can create an email and 
// password 
//import { Authenticator } from '@aws-amplify/ui-react';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify
// Set the AWS Region
AWS.config.update({
    region: "us-east-1", // make sure this is the region your Cognito service is hosted in
  });

const generateTemporaryPassword = () => {
    const numbers = '0123456789';
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const specialCharacters = '!@#$%^&*()_+';
    const base = lowerCaseLetters + upperCaseLetters + numbers + specialCharacters;

    let password = "";
    // Ensure at least one character from each set
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)];
    password += upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)];
    password += specialCharacters[Math.floor(Math.random() * specialCharacters.length)];

    // Fill the rest of the password length to meet the minimum required (e.g., 8 characters)
    for (let i = password.length; i < 12; i++) {
        password += base[Math.floor(Math.random() * base.length)];
    }

    // Shuffle the password to ensure randomness (Optional)
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    return password;
}


const AddUni = () => {
const cognitoPoolId="us-east-1_PraHctOMo";
const CognitoIdentityServiceProvider= new AWS.CognitoIdentityServiceProvider();

    const [email, setEmail] = useState('');

    async function handleAddEmail() {
        if (!email) {
            toast.error("Please enter an email address.");
            return;
        }
     const tempPassword = generateTemporaryPassword(); // Generate a compliant temporary password
     const params:AWS.CognitoIdentityServiceProvider.AdminCreateUserRequest = {
        UserPoolId: cognitoPoolId, // Replace with your User Pool ID
        
        Username: email,
        TemporaryPassword: tempPassword,
        UserAttributes: [
            {
                Name: 'email',
                Value: email
            },
            {
                Name: 'email_verified',
                Value: 'true'
            }
        ],
        // MessageAction: 'RESEND', // Optionally, uncomment this line if needed
        DesiredDeliveryMediums: ["EMAIL"]
    };
    
    try {
        const response = await CognitoIdentityServiceProvider.adminCreateUser(params).promise();
        console.log("Admin create user successful", response);
        toast.success("Verification email sent to " + email);
    } catch (error) {
        console.error("Error creating user:", error);
        toast.error("Failed to create user: " );
    }
}
    
    
    

    return (
        <DefaultLayout>
        <Breadcrumb pageName="Add University" />
        <div className="container mx-auto px-4 py-8">
            <h1>Add University Email</h1>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
           
            <button onClick={handleAddEmail}>Add Email</button>
        </div>

    </DefaultLayout>
  );
};

export default AddUni;