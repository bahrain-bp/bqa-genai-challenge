import React, { useState } from "react";
//import { Auth } from "aws-amplify";
//import { useNavigate } from "react-router-dom";
//import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
//import LoaderButton from "../components/LoaderButton";
//import { useFormFields } from "../lib/hooksLib";
//import { onError } from "../lib/errorLib";
import { updatePassword } from 'aws-amplify/auth';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";



const ChangePassword = () => {
    
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleChangePassword = async (e:any) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            console.log('New password and confirm password do not match');
            toast.error('New password and confirm password do not match');
            return;
        }
        try {
            await updatePassword({ oldPassword, newPassword });
            console.log('Password updated successfully');
            toast.success('Password updated successfully');


            // Add code to notify user or redirect them to a success page
        } catch (err) {
            console.log('Error updating password:', err);
            toast.error('Error updating password');

            // Add code to handle error, e.g., display error message to the user
        }
    };




    return (
        <DefaultLayout>
        <Breadcrumb pageName="Change Password" />


        <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleChangePassword} className="max-w-md mx-auto">
        <div className="mb-4">
        <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700"> Old Password:</label>
                    <input
                        type="password"
                        id="oldPassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Enter old password"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"

                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password:</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"

                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password:</label>
                    <input
                        type="password"
                        id="confirmNewPassword"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"

                    />
                </div>
                <div className="mb-4">
                    <button type="submit" 
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
                        Change Password</button>
                </div>
            </form>

       
        
    </div>
    </DefaultLayout>

    );
}

export default ChangePassword;



