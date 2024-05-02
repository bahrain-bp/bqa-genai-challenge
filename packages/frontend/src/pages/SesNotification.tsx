import React, { useState } from 'react'; 

// Import Node.js file system module to use my own html template
// import fs from 'fs';

import DefaultLayout from '../layout/DefaultLayout';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

const SendEmail: React.FC = () => { // if you recieve an error run: npm install @types/react

  // State to store the selected file
    const [fileData, setFileData] = useState({    
      userEmail: '',
      subject: '',
      body: '',
      attachments: null,
    });
    
  // State to store the result of sending the email
    const [result, setResult] = useState('');
    
  // Template for the email body
    // const htmlTemplate = fs.readFileSync('[path]', 'utf8'); // replace [path] with the path to the html template file
    
  // Function to send the email 
    const sendEmail = async (EmailContent : {userEmail: string; subject: string; body: string; attachments: FileList | null;}) =>
    {
      const fileData = new FormData();
      fileData.append('userEmail', EmailContent.userEmail);
      fileData.append('subject', EmailContent.subject);
      fileData.append('body', EmailContent.body);

      if (EmailContent.attachments) {
        for (let i = 0; i < EmailContent.attachments.length; i++) {
          fileData.append('attachments', EmailContent.attachments[i]);
        }
      }
      
      try
      {
        const response = await fetch("", // Add API invoke URL here
          {
            method: 'POST',
            body: fileData,
          });
        return await response.json(); 
      } 
      catch (error)
      {
        console.error('Error sending email:', error);
        setResult('Error sending email');
      }
    }

    // Function to handle the send email button
    const handleSendEmail = async (e : any) => 
    {
      e.preventDefault();
      try 
      {
        const response = await sendEmail(fileData);
        if (response && response.result === 'OK') 
          {
            setResult('Email sent successfully');
          } else {
            setResult('Error sending email');
          }
      } 
      catch (error) 
      {
        console.error('Error sending email:', error);
        setResult('Error sending email');
      }
    }

    // Function to handle file change
    const handleFileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type } = e.target;

      if (type === 'file') {
        const files = e.target.files;
        if (files) {
          setFileData({ ...fileData, [name]: files });
        }
      } else {
        setFileData({ ...fileData, [name]: value });
      }
    }

    return (
      <DefaultLayout>
        <Breadcrumb pageName="Upload Dummy File" />
        <div className="col-span-5 xl:col-span-2">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                <b>Upload A File that contains the keyword "Standard" or else a notification will be sent..</b>
              </h3>
            </div>
            <div className="p-4">
              <div
                id="FileUpload"
                className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
              >
                <input
                  type="file"
                  accept="*"
                  className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* SVG paths */}
                    </svg>
                  </span>
                  <p>
                    <span className="text-primary">Click to upload</span> or drag and drop
                  </p>
                  <p className="mt-1.5">Any file type</p>
                  {/* show file name with extension */}
                </div>
              </div>
            </div>  
            <div className="flex justify-end gap- mb-5">
              <button className="flex justify-center align-center rounded bg-success py-2 px-6 font-medium text-gray hover:bg-opacity-90 mr-4"
                type="button" 
                onClick={handleSendEmail}>
                  Send Test Email 
              </button>
            </div>            
          </div>
        </div>
      </DefaultLayout>
    );
};
export default SendEmail;