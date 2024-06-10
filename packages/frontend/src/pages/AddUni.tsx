import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import './PredefinedTemplate.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiUrl = import.meta.env.VITE_API_URL;

const generateTemporaryPassword = () => {
  const numbers = '0123456789';
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const specialCharacters = '!@#$%^&*()_+';
  const base = lowerCaseLetters + upperCaseLetters + numbers + specialCharacters;
  let password = '';

  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)];
  password += upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)];
  password += specialCharacters[Math.floor(Math.random() * specialCharacters.length)];

  for (let i = password.length; i < 12; i++) {
    password += base[Math.floor(Math.random() * base.length)];
  }

  password = password.split('').sort(() => 0.5 - Math.random()).join('');

  return password;
};

const AddUni = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setLogo(file);
  };

  async function handleAddEmail() {
    if (!email || !name || !logo) {
      toast.error('Please fill all the fields.');
      return;
    }
    const tempPassword = generateTemporaryPassword();

    try {
      const emailAvailable = await createUser(email, tempPassword, name);
      if (emailAvailable) {
        // Attempt to upload the logo only if the email is not in use and user creation is successful
        const LOGOZ = await uploadLogo(logo, name);
        if (LOGOZ) { // Check if logo was uploaded successfully
          toast.success('User and logo added successfully!');
          navigate('/BqaDash1');
        } else {
          // Handle the case where the user is created but the logo upload fails
          toast.error('Logo upload failed.');
        }
      } else {
        // Handle the case if email is already in use and user is not created
        console.log('Errro creatin user');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred during user creation or logo upload.');
    }


  }

  const createUser = async (email: string, tempPassword: string, name: string) => {
    const url = `${apiUrl}/createUser`;
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, tempPassword, name }),
    };

    try {
      const response = await fetch(url, requestOptions);
      if (response.ok) {
        const data = await response.json();
        console.log('User created successfully:', data);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Failed to create user:', errorData);
        toast.error('Please ensure the email address is not already in use and that it is formatted correctly');
      return false;

      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error creating user:');
    }
  };
  const uploadLogo = async (logo: File, name: string) => {
    if (!logo) {
      toast.error('Please select a logo to upload.');
      return false;
    }

    const url = `${apiUrl}/uploadLogo`;

    const formData = new FormData();
    formData.append('logo', logo, logo.name);

    const requestOptions: RequestInit = {
      method: 'POST',
      body: logo,
      headers: {
        'file-name': logo.name,
        'bucket-name': 'uni-artifacts',
        'folder-name': name,
        'subfolder-name': 'logos',
        'content-type': "image/*" // Corrected to get the MIME type from the file itself
      },
    };

    try {
      const response = await fetch(url, requestOptions);
      if (response.ok) {
        const data = await response.json();
        console.log('Logo uploaded successfully:', data);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Failed to upload logo:', errorData);
        return false;

      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Error uploading logo.');
      return false;
    }
  };


  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add University Details" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <label
              htmlFor="universityEmail"
              className="block text-m font-medium text-gray-700"
            >
              University Email:
            </label>
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
            <label
              htmlFor="universityName"
              className="block text-m font-medium text-gray-700"
            >
              University Name:
            </label>
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
            <label
              htmlFor="logo"
              className="block text-m font-medium text-gray-700"
            >
              University Logo:
            </label>
            <input
              id="logo"
              type="file"
              onChange={handleFileChange}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <button
              onClick={handleAddEmail}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Add Email
            </button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddUni;
