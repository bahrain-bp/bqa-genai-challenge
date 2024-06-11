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
    dateCreated: '',
    status: 'unarchived',
  });
  const [records, setRecords] = useState<any[]>([]); // Initialize state to store fetched records
  const [loading, setLoading] = useState<boolean>(true);


  const handleChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
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
  

  const handleDelete = async (description: string) => {
    try {
      // Define the confirmation dialog options
      const confirmationOptions = {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this comment?',
        buttons: [
          {
            label: 'Yes',
            onClick: async () => {
              try {
                // Find the record with the matching description
                const recordToDelete = records.find(record => record.description === description);
                if (!recordToDelete) {
                  throw new Error('Record not found for the given comment');
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
               
                toast.success('Comment deleted successfully');
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
  
  const handleArchive = async (description: string) => {
    try {
      // Define the confirmation dialog options
      const confirmationOptions = {
        title: 'Confirm Archive',
        message: 'Are you sure you want to archive this comment?',
        buttons: [
          {
            label: 'Yes',
            onClick: async () => {
              try {
                // Find the record with the matching documentURL
                const recordToArchive = records.find(record => record.description === description);
                if (!recordToArchive) {
                  throw new Error('Record not found for the given comment');
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
                toast.success('Comment archived successfully');
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
      // Get the standardId from the URL
      const indicatorId = window.location.pathname.split('/').pop();
  
      // Create record in DynamoDB
      const newRecordData = {
        ...recordData,
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
      setShowForm(false);
      fetchRecords(indicatorId); // Fetch records for the extracted standard name
      setRecordData({
        entityType: '',
        entityId: '',
        standardId: '',
        standardName: '',
        indicatorName: '',
        description: '',
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

       Add New Comments

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
            <label className="block text-sm font-medium text-gray-700"  style={{fontSize: 18}}> Add New Comment</label><br></br>
             
           
           
            <div className="mb-4">
            <label>Standard Name</label>
              <input type='text' name="standard" value={standardName} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
            </div>
            <div className="mb-4">
              <label>Indicator Name</label>
              <input type='text' name="indicator" value={indicatorName} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
            </div>
            <div className="mb-4">
              <label> Comment</label><br></br>
              <textarea  name="description" value={recordData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        style={{ width: '400px', height: '100px' }}/>
            </div>
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
        <h2>{standardName}/{indicatorName}</h2>
        <h6>Below are the comments to help ensure that applicable standards/indicator’s expectations are being met.</h6>
      </div>
      {records
        .filter(record => record.description && record.status !== 'archived') // Filter based on documentURL and status
        .map((record, index) => {
          return (
            <div key={index} className="record">
              <div className="container">
              <div className="d-flex justify-content-center">
              <div className="card rounded-xl border border-stroke bg-white shadow-default border-info">
              <div className="card-body py-4 px-5">
                        {/* <a href={record.documentURL} className="link-unstyled"> */}
                          <div className="d-flex align-items-center">
                            <div>
                              {/* <h4 className="my-1 text-info">{documentName}</h4> */}
                              <p className="mb-0 font-13" style={{ fontWeight: 'normal' }}>{record.description}</p>
                            </div>
                          </div>
                        {/* </a> */}
                        {isAdmin && (
        <>
                        {/* Delete icon */}
                        <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={() => handleDelete(record.description)} />
                        {/* Archive icon */}
                        <FontAwesomeIcon icon={faArchive} className="archive-icon" onClick={() => handleArchive(record.description)} />
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
