import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import React, { useState } from 'react';
// import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SendEmail = () => {
  // State to store the selected file
    const [fileName, setFileName] = useState<File | null>(null);

  // on load function
  const onload = (fileString:any) => {
    setFileName(fileString);
  }

  // Function to read the file content
    const readFileAsText = (file: File) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        onload(reader.result)
      }
    };

    // Function to handle the send email button
    const handleSendEmail = (e : any) => 
    {
      e.preventDefault();
      
      // Call the my API gateway
      fetch (""), // Add API invocke URL here
      {
        mode: 'no-cors',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderName: 'maryam',
          senderEmail: 'maryamkameshki02@gmail.com',
          message: 'Hello from the frontend!',
          Date: new Date().toISOString(),
          fileName: "Test_File",
        }),
      }   
    }

    // Function to handle file change
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const file = files[0];
        readFileAsText(file);
      }
  };
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
                  {fileName && <p>{fileName.name}</p>}
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