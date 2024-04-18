import { confirmSignUp, type ConfirmSignUpInput } from 'aws-amplify/auth';
import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import { Link } from 'react-router-dom'; 
const NewUser = () => {
    const [email, setEmail] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');

    const handleConfirmEmail = async () => {
        try {
            await confirmSignUp({username:email, confirmationCode });            console.log('Email confirmed successfully:', email);
            toast.success('Email is confirmed successfuly! Please sign in and change your password ');
        } catch (error) {
            console.error('Error confirming email:', error);
            toast.error('Error confirming your email');

            // Handle error (e.g., show error message to user)
        }
    };

    return (
       
        
        <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
         <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

         <h1 className="text-2xl font-semibold mb-4">Confirm University Email</h1>
            <div className="mb-4">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"

            />
          </div>


            <div className="mb-4">
            <input
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                placeholder="Confirmation Code"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"

            />
            </div>

            <div className="mb-4">

            <button onClick={handleConfirmEmail}
           className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none"

            >Confirm Email</button>
            </div>

            <div className="text-center">
                    <Link to="/Auth/SigninPage" className="text-blue-500 hover:underline">Back to Sign In</Link>
                </div>
            </div>

        </div>
      

    );
};

export default NewUser;
