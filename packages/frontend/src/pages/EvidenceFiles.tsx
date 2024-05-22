import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import './PredefinedTemplate.css'; // Importing CSS file
import './PredefinedTemplate.css'; // Importing CSS file
import '@fortawesome/fontawesome-free/css/all.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faArchive } from '@fortawesome/free-solid-svg-icons';
import Loader from '../common/Loader';
import {fetchUserAttributes } from 'aws-amplify/auth';
// import * as AWS from 'aws-sdk';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify


import { useTranslation } from 'react-i18next';


//INDICATORS FILE **


const EvidenceFiles: React.FC = () => {
 // Get the standardId from the URL
 
const indicatorId = window.location.pathname.split('/').pop();
const { t } = useTranslation(); // Hook to access translation functions
    

// Set the value of the input field if it exists
const inputElement = document.querySelector<HTMLInputElement>('input[name="standardId"]');
if (inputElement) {
    inputElement.value = indicatorId ?? '';
}

const [showForm, setShowForm] = useState(false); // State variable to toggle form visibility
const [indicatorName, setIndicatorName] = useState('');
const [standardId, setStandardId] = useState<any[]>([]);
const [standardName, setStandardName] = useState<any[]>([]);
const [indicators, setIndicators] = useState<any[]>([]); // State variable to store indicators
const [isAdmin, setIsAdmin] = useState<boolean>(false);
const [/*currentName*/, setCurrentName] = useState('');


  const [recordData, setRecordData] = useState({
    entityType: '',
    entityId: '',
    standardId: '',
    standardName: '',
    indicatorName: '',
    description: '',
    documentName: '',
    documentURL: '', // Initialize documentURL state
    dateCreated: '',
    status: 'unarchived',
  });
  const [records, setRecords] = useState<any[]>([]); // Initialize state to store fetched records
  const [loading, setLoading] = useState<boolean>(true);


  const handleChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = event.target;
  
    if (event.target instanceof HTMLSelectElement) { // Check if the event target is a HTMLSelectElement
      // Find the selected indicator by its ID
      const selectedIndicator = indicators.find((indicator) => indicator.indicatorId === value);
      // If the indicator is found, update the recordData with its name
      if (selectedIndicator) {
        setRecordData(prevState => ({
          ...prevState,
          [name]: value,// Set the indicatorName
        }));
      }
    } else {
      
      // For other fields, update the recordData
      setRecordData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
  
  const handleDelete = async (documentURL: string) => {
    try {
      // Find the record with the matching documentURL
      const recordToDelete = records.find(record => record.documentURL === documentURL);
      if (!recordToDelete) {
        throw new Error('Record not found for the given document URL');
      }
      const api = import.meta.env.VITE_API_URL;
      const apiUrl = `${api}/standards/${recordToDelete.entityId}`;
      const response = await fetch(apiUrl, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete record');
      }
  
      // Remove the deleted record from the state
      setRecords(records.filter(record => record.entityId !== recordToDelete.entityId));
     
      toast.success('File deleted successfully');
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Failed to delete file');
    }
  };

  const handleArchive = async (documentURL: string) => {
    try {
      // Find the record with the matching documentURL
      const recordToArchive = records.find(record => record.documentURL === documentURL);
      if (!recordToArchive) {
        throw new Error('Record not found for the given document URL');
      }
          // Print the record to be updated in the console
    console.log('Record to be archived:', recordToArchive);

    const api = import.meta.env.VITE_API_URL;
      const apiUrl = `${api}/standards/${recordToArchive.entityId}`;
      const response = await fetch(apiUrl, {
        method: 'PUT', // Use PUT method to update the record
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...recordToArchive, status: 'archived' }), // Update the status field to 'archived'
      });
      if (!response.ok) {
        throw new Error('Failed to archive record');
      }
  
      // Fetch records again to reflect the changes
      fetchRecords(recordToArchive.indicatorId);
      console.log('Record to be archived:', recordToArchive);
      toast.success('File archived successfully');
    } catch (error) {
      console.error('Error archiving record:', error);
      toast.error('Failed to archive file');
    }
  };
  
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleCancel = () => {
    setShowForm(false);
    // Reset recordData if needed
  };

  const createRecord = async () => {
    try {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        throw new Error('Please select a file.');
      }
      const file = fileInput.files[0];
  
      // Get the standardId from the URL
      const indicatorId = window.location.pathname.split('/').pop();
  
      // Handle file upload
      const selectedStandard = `${standardId}/${indicatorId}`;// Get the selected standard value
      await handleFileSelect(file, selectedStandard);
  
      // Create record in DynamoDB
      const documentURL = `https://d2qvr68pyo44tt.cloudfront.net/${selectedStandard}/${file.name}`;
      const newRecordData = {
        ...recordData,
        documentName: file.name,
        documentURL,
        standardId: standardId, // Ensure standardId is included in the record data
        standardName: standardName, // Include standardName in recordData
        indicatorId: indicatorId, // Ensure standardId is included in the record data
        indicatorName: indicatorName, // Include standardName in recordData
      };
      const api = import.meta.env.VITE_API_URL;
      const response = await fetch(`${api}/standards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecordData),
      });
      if (!response.ok) {
        throw new Error('Failed to create record');
      }
      const data = await response.json();
      console.log('New record created:', data);
      toast.success('New file Added successfully');
      setShowForm(false);
      fetchRecords(indicatorId); // Fetch records for the extracted standard name
      setRecordData({
        entityType: '',
        entityId: '',
        standardId: '',
        standardName: '',
        indicatorName: '',
        description: '',
        documentName: '',
        documentURL: '',
        dateCreated: '',
        status: 'unarchived',
      });
    } catch (error) {
      console.error('Error creating record:', error);
      toast.error('Failed to create record');
    }
  };
  const fetchStandardId = async (indicatorId: string | undefined) => {
    try {
      // Make API call to fetch standard name based on standardId
      const api = import.meta.env.VITE_API_URL;
      const response = await fetch(`${api}/standards?indicatorId=${indicatorId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch standardId');
      }
      const data = await response.json();
  // Filter standards to include only those with matching standardId
  const filteredStandards = data.filter((indicator: any) => indicator.indicatorId === indicatorId);
  
  // Assuming data is an array of records, select the first one
  const standardId = filteredStandards.length > 0 ? filteredStandards[0].standardId : '';
  
  // Update state with the fetched standard name
  setStandardId(standardId);
  
    } catch (error) {
      console.error('Error fetching standards:', error);
    }
  };
  
  const fetchStandardName = async (indicatorId: string | undefined) => {
    try {
      // Make API call to fetch standard name based on standardId
      const api = import.meta.env.VITE_API_URL;
      const response = await fetch(`${api}/standards?indicatorId=${indicatorId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch standards');
      }
      const data = await response.json();
  // Filter standards to include only those with matching standardId
  const filteredStandards = data.filter((indicator: any) => indicator.indicatorId === indicatorId);
  
  // Assuming data is an array of records, select the first one
  const standardName = filteredStandards.length > 0 ? filteredStandards[0].standardName : '';
  
  // Update state with the fetched standard name
  setStandardName(standardName);
  
    } catch (error) {
      console.error('Error fetching standards:', error);
    }
  };

  const fetchIndicators = async (standardId: string | undefined) => {
    try {
      const api = import.meta.env.VITE_API_URL;
      const response = await fetch(`${api}/standards?standardId=${standardId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch indicators');
      }
      const data = await response.json();
      // Filter indicators to include only those with matching standardId
      const filteredIndicators = data.filter((indicator: any) => indicator.standardId === standardId);
      setIndicators(filteredIndicators); // Update state with filtered indicators
    } catch (error) {
      console.error('Error fetching indicators:', error);
    }
  };

  const fetchRecords = async (indicatorId: string | undefined) => {
    try {
      // Constructing URL with standard name
      const api = import.meta.env.VITE_API_URL;
      const apiUrl = `${api}/standards?standard=${indicatorId}`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      const data = await response.json();
      // Filter records based on indicatorId
      const filteredRecords = data.filter((record: { indicatorId: string | undefined }) => record.indicatorId === indicatorId);

      setRecords(filteredRecords); // Update state with fetched records
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };
  
  useEffect(() => {
    //add credentials for demo
    const indicatorId = window.location.pathname.split('/').pop();
    
 // Fetch indicators based on the standardId
 fetchIndicatorName(indicatorId);
 fetchStandardId(indicatorId);
 fetchStandardName(indicatorId);
    fetchIndicators(indicatorId);
    fetchRecords(indicatorId); 
    
 // Fetch indicators based on the standardId
 fetchIndicatorName(indicatorId);
 fetchStandardId(indicatorId);
 fetchStandardName(indicatorId);
    fetchIndicators(indicatorId);
    fetchRecords(indicatorId); 
  }, []);
  
  useEffect(() => {
    const fetchCurrentUserInfo = async () => {
      try {
        const attributes = await fetchUserAttributes();
        const name:any= attributes.name;
        setCurrentName(name);
        setIsAdmin(name.endsWith("BQA Reviewer") || false);

      } catch (error) {
        console.error('Error fetching current user info:', error);
      }
    };

    fetchCurrentUserInfo();
  }, []);


  useEffect(() => {
    const fetchCurrentUserInfo = async () => {
      try {
        const attributes = await fetchUserAttributes();
        const name:any= attributes.name;
        setCurrentName(name);
        setIsAdmin(name.endsWith("BQA Reviewer") || false);

      } catch (error) {
        console.error('Error fetching current user info:', error);
      }
    };

    fetchCurrentUserInfo();
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);


  //uncomment this for demo*
  // async function uploadToS3Evidence(fileData: Blob | File, fileName: string, folderName: string) {
  //   try {
  //     var upload = new AWS.S3.ManagedUpload({
  //       params: {
  //         Bucket:  'bqa-standards-upload',
  //         Key: folderName + '/' + fileName,
  //         Body: fileData
  //       },
  //     });
    
  //     var promise = upload.promise();

  //     promise.then(
  //       function () {
  //         console.log("Successfully uploaded file.");
  //       },
  //       function () {
  //         return  console.log("There was an error uploading your file: ");
  //       }
  //     );
  //     return { message: 'File uploaded successfully'};
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //     throw new Error('Failed to upload file');
  //   }
  // }
  //uncomment this for demo*

  async function uploadToS3Evidence(fileData: Blob | File, fileName: string, folderName: string) {
    try {
      const AWS = require('aws-sdk');
      const s3 = new AWS.S3();

    const uploadParams = {
      Bucket: 'bqa-standards-upload',
      Key: folderName + '/' + fileName,
      Body: fileData
    };

    const upload = s3.upload(uploadParams);

    upload.promise()
  .then(function() {
    alert("Successfully uploaded file.");
  })
  .catch(function() {
    alert("There was an error uploading your file: ");
  });
      return { message: 'File uploaded successfully'};
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  async function handleFileSelect(file: File, selectedFolder: string) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      if (e.target) {
        const fileContent = e.target.result as string;
  
        const uploadParams = {
          body: new Blob([fileContent], { type: file.type }),
          headers: {
            'Content-Type': file.type,
            'file-name': file.name
          }
        };
        uploadToS3Evidence(uploadParams.body, uploadParams.headers['file-name'], selectedFolder)
          .then(response => {
            console.log(response);
            toast.success('File uploaded successfully!');
          })
          .catch(error => {
            console.error('Error uploading file:', error);


          });
      }
    };
  
    fileReader.readAsBinaryString(file);
  }

const fetchIndicatorName = async (indicatorId: string | undefined) => {
  try {
    // Make API call to fetch standard name based on standardId
    const api = import.meta.env.VITE_API_URL;
    const response = await fetch(`${api}/standards?indicatorId=${indicatorId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch standards');
    }
    const data = await response.json();
// Filter standards to include only those with matching standardId
const fileteredIndicators = data.filter((indicator: any) => indicator.indicatorId === indicatorId);

// Assuming data is an array of records, select the first one
const indicatorName = fileteredIndicators.length > 0 ? fileteredIndicators[0].indicatorName : '';

// Update state with the fetched standard name
setIndicatorName(indicatorName);

  } catch (error) {
    console.error('Error fetching standards:', error);
  }
};
    
return loading ? (
  <Loader />
) : (
    <DefaultLayout>
     

<div>
{isAdmin?(  

<div className="button-container">

<button
        className={`flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90 mr-4`}
        type="button" // Change type to "button"
        onClick={toggleForm} // Add onClick handler
      >

       {t('uploadEvidence')}

      </button>
      
      </div>
 ):null}
      {showForm && (
        
          <div className="modal-overlay">
            <div className="modal-content">
            
           
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{t('uploadDocument')}</label>
              <input type="file" name="documentName" value={recordData.documentName} onChange={handleChange}className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 
                focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div><br />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{t('documentDescription')}</label>
              <input type="text" name="description" value={recordData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 
                focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div><br />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{t('status')}</label>
              <input type="text" name="status" value={recordData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 
                focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" readOnly />
            </div><br />
            <div className="form-buttons">
            <button
        className="bg-blue-500 flex rounded border border-stroke py-2 px-6 font-medium text-white hover:shadow-1 dark:border-strokedark dark:text-white mr-4"
        type="button"
        onClick={handleCancel}
      >

        {t('cancel')}


      </button>
      <button
         className="bg-blue-500 flex rounded border border-stroke py-2 px-6 font-medium text-white hover:shadow-1 dark:border-strokedark dark:text-white mr-4"
           type="button" // Change type to "button"
        onClick={createRecord} // Add onClick handler
      >

        {t('save')}


      </button>
      </div>
      </div>
          </div>
          
        )}
</div>


      
<div className="download-header">
        <h2> {t('downloadFiles')}</h2>
        <h6></h6>
      </div>
      {records
        .filter(record => record.documentURL && record.status !== 'archived') // Filter based on documentURL and status
        .map((record, index) => {
          // Extracting document name from the URL
          const urlParts = record.documentURL.split('/');
          const documentName = urlParts[urlParts.length - 1];

          return (
            <div key={index} className="record">
              <div className="container">
              <div className="d-flex justify-content-center">
              <div className="card rounded-xl border border-stroke bg-white shadow-default border-info">
              <div className="card-body py-4 px-5">
                        <a href={record.documentURL} className="link-unstyled">
                          <div className="d-flex align-items-center">
                            <div>
                              <h4 className="my-1 text-info">{documentName}</h4>
                              <p className="mb-0 font-13" style={{ fontWeight: 'normal' }}>{record.description}</p>
                            </div>
                          </div>
                        </a>
                        {isAdmin && (
        <>
                        {/* Delete icon */}
                        <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={() => handleDelete(record.documentURL)} />
                        {/* Archive icon */}
                        <FontAwesomeIcon icon={faArchive} className="archive-icon" onClick={() => handleArchive(record.documentURL)} />
                        </>
      )}
                      </div>
                    </div>
                
                </div>
              </div>
            </div>
          );
        })}
    </DefaultLayout>
  );
};

export default EvidenceFiles;
