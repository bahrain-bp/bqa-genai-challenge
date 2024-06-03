import React, { useState, useEffect } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import './PredefinedTemplate.css'; // Importing CSS file
import '@fortawesome/fontawesome-free/css/all.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faArchive } from '@fortawesome/free-solid-svg-icons';
import Loader from '../common/Loader';
// import * as AWS from 'aws-sdk';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify
import { confirmAlert } from 'react-confirm-alert';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {fetchUserAttributes } from 'aws-amplify/auth';



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
      // Define the confirmation dialog options
      const confirmationOptions = {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this file?',
        buttons: [
          {
            label: 'Yes',
            onClick: async () => {
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
                console.error('Error deleting records:', error);
                toast.error('Error deleting records:');
              }
            },
          },
          {
            label: 'No',
            onClick: () => {}, // Do nothing if "No" is clicked
          },
        ],
      };
  
      // Show the confirmation dialog
      confirmAlert(confirmationOptions);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Confirmation error:', errorMessage);
      toast.error(`Failed to confirm deletion: ${errorMessage}`);
    }
  };
  
  const handleArchive = async (documentURL: string) => {
    try {
      // Define the confirmation dialog options
      const confirmationOptions = {
        title: 'Confirm Archive',
        message: 'Are you sure you want to archive this file?',
        buttons: [
          {
            label: 'Yes',
            onClick: async () => {
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
                console.error('Error archiving records:', error);
                toast.error('Error archiving records:');
              }
            },
          },
          {
            label: 'No',
            onClick: () => {}, // Do nothing if "No" is clicked
          },
        ],
      };
  
      // Show the confirmation dialog
      confirmAlert(confirmationOptions);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Confirmation error:', errorMessage);
      toast.error(`Failed to confirm deletion: ${errorMessage}`);
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

  
const navigate = useNavigate();
  
const goBack = () => {
  navigate(-1); // Moves one step back in the browser's history stack
};

    
return loading ? (
  <Loader />
) : (
    <DefaultLayout>


<div>
{isAdmin?(  

<div className="button-container1">



<button
        className={`flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90 mr-4`}
        type="button" // Change type to "button"
        onClick={toggleForm} // Add onClick handler
      >

       {t('uploadEvidence')}

      </button>
      
      </div>
 ):null}

<div className="button-container">
 <button onClick={goBack} style={{
  padding: '8px 16px',
  //backgroundColor: '#3c50e0',
  color: 'black',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: '',
  marginTop: '-15px' ,// Adjust this value as needed

}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}>
    <path fillRule="evenodd" d="M15 8a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708.708L2.707 7.5H14.5A.5.5 0 0 1 15 8z"/>
  </svg>Back</button><br></br>

  </div>
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
        className={`flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90 mr-4`}
        type="button"
        onClick={handleCancel}
      >

        {t('cancel')}


      </button>
      <button
        className={`flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90 mr-4`}
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
                        <button
                        className="hover:text-primary"
                        onClick={() => handleDelete(record.documentURL)}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                            fill=""
                          />
                          <path
                            d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                            fill=""
                          />
                          <path
                            d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                            fill=""
                          />
                          <path
                            d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                            fill=""
                          />
                        </svg>
                      </button>
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
