import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import './PredefinedTemplate.css'; // Importing CSS file
import { signUp, confirmSignUp } from 'aws-amplify/auth';

// Add authenticator so only admin can create an email and 
// password 
//import { Authenticator } from '@aws-amplify/ui-react';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify

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


    const [email, setEmail] = useState('');

    async function handleAddEmail() {
        try {
            const tempPassword = generateTemporaryPassword(); // Generate a compliant temporary password
            const response = await signUp({
                username: email,
                password: tempPassword, // Use the generated temporary password
                
            });
            console.log("Sign up successful", response);
            alert("Verification email sent to " + email);
        } catch (error) {
            console.error("Error signing up:", error);
            alert("Failed to sign up: " );
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



