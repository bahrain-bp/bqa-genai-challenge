
import React, { useState, useEffect } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import './PredefinedTemplate.css'; // Importing CSS file
import '@fortawesome/fontawesome-free/css/all.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faArchive } from '@fortawesome/free-solid-svg-icons';
import Loader from '../common/Loader';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify
import {fetchUserAttributes } from 'aws-amplify/auth';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';


//INDICATORS FILE **


const PredefinedTemplate: React.FC = () => {
 // Get the standardId from the URL
const standardId = window.location.pathname.split('/').pop();
const { t } = useTranslation(); // Hook to access translation functions
const [isAdmin, setIsAdmin] = useState<boolean>(false);
const [/*currentName*/, setCurrentName] = useState('');
// Set the value of the input field if it exists
const inputElement = document.querySelector<HTMLInputElement>('input[name="standardId"]');
if (inputElement) {
    inputElement.value = standardId ?? '';
}

const [showForm, setShowForm] = useState(false); // State variable to toggle form visibility
const [standardName, setStandardName] = useState('');
// const [standardName, setStandardName] = useState<any[]>([]);
const [indicators, setIndicators] = useState<any[]>([]); // State variable to store indicators
// const [isAdmin, setIsAdmin] = useState<boolean>(false);
// const [/*currentName*/, setCurrentName] = useState('');


  const [recordData, setRecordData] = useState({
    entityType: '',
    entityId: '',
    standardId: '',
    standardName: '',
    indicatorId: '',
    indicatorName: '',
    description: '',
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
          [name]: value,
          indicatorName: selectedIndicator.indicatorName // Set the indicatorName
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
  const handleDelete = async (indicatorId: string) => {
    try {
      // Define the confirmation dialog options
      const confirmationOptions = {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this indicator?',
        buttons: [
          {
            label: 'Yes',
            onClick: async () => {
              try {
                // Fetch records with the matching standardId
                const recordsToDelete = records.filter(record => record.indicatorId === indicatorId);
                if (recordsToDelete.length === 0) {
                  throw new Error('No records found for the given standardId');
                }
            
                // Delete each record
                await Promise.all(recordsToDelete.map(async record => {
                  const api = import.meta.env.VITE_API_URL;
                  const apiUrl = `${api}/standards/${record.entityId}`;
                  const response = await fetch(apiUrl, {
                    method: 'DELETE',
                  });
                  if (!response.ok) {
                    throw new Error(`Failed to delete record with entityId: ${record.entityId}`);
                  }
                }));
            
                // Remove the deleted records from the state
                setRecords(records.filter(record => !recordsToDelete.includes(record)));
                toast.success('Records deleted successfully');
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
  
  const handleArchive = async (indicatorId: string) => {
    try {
      // Define the confirmation dialog options
      const confirmationOptions = {
        title: 'Confirm Archive',
        message: 'Are you sure you want to archive this indicator?',
        buttons: [
          {
            label: 'Yes',
            onClick: async () => {
              try {
                // Fetch records with the matching standardId
                const recordsToArchive = records.filter(record => record.indicatorId === indicatorId);
                if (recordsToArchive.length === 0) {
                  throw new Error('No records found for the given standardId');
                }
            
                // Update status to 'archived' for each record
                await Promise.all(recordsToArchive.map(async record => {
                  const api = import.meta.env.VITE_API_URL;
                  const apiUrl = `${api}/standards/${record.entityId}`;
                  const response = await fetch(apiUrl, {
                    method: 'PUT', // Use PUT method to update the record
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...record, status: 'archived' }), // Update the status field to 'archived'
                  });
                  if (!response.ok) {
                    throw new Error(`Failed to archive record with entityId: ${record.entityId}`);
                  }
                }));
            
                // Fetch records again to reflect the changes
                fetchRecords(standardId);
                toast.success('Records archived successfully');
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
   const standardId = window.location.pathname.split('/').pop();
  
      // Create record in DynamoDB
       const newRecordData = {
        ...recordData,
        standardId: standardId, // Ensure standardId is included in the record data
      standardName: standardName // Include standardName in recordData
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
        throw new Error('Failed to create Indicator');
      }
      const data = await response.json();
      console.log('New Indicator created:', data);
      setShowForm(false);
     
      fetchRecords(standardId); // Fetch records for the extracted standard name
      setRecordData({
        entityType: '',
        entityId: '',
        standardId: '',
        standardName: '',
        indicatorId: '',
        indicatorName: '',
        description: '',
        dateCreated: '',
        status: 'unarchived',
      });
      toast.success('Indicator created successfully!');
    } catch (error) {
      console.error('Error creating Indicator:', error);
      toast.error('Failed to create Indicator');
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

  const fetchRecords = async (standardId: string | undefined) => {
    try {
      const api = import.meta.env.VITE_API_URL;
      const response = await fetch(`${api}/standards?standard=${standardId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      const data: any[] = await response.json(); // Assuming your records have type any
      
      // Sort records based on the numeric value in the standardId
      const sortedRecords = data
      .filter((record: any) => record.indicatorId && record.status !== 'archived')
      .sort((a: any, b: any) => {
        const indicatorIdA = parseInt((a.indicatorId || '').replace('Indicator', ''));
        const indicatorIdB = parseInt((b.indicatorId || '').replace('Indicator', ''));
        return indicatorIdA - indicatorIdB;
      });
      

      // Filter records based on standardId
      const filteredRecords = sortedRecords.filter((record: { standardId: string | undefined }) => record.standardId === standardId);

      setRecords(filteredRecords);
  
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };
  


  useEffect(() => {
    const standardId = window.location.pathname.split('/').pop();
    
 // Fetch indicators based on the standardId
    fetchStandardName(standardId);
    fetchIndicators(standardId);
    fetchRecords(standardId); 
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



const fetchStandardName = async (standardId: string | undefined) => {
  try {
    // Make API call to fetch standard name based on standardId
    const api = import.meta.env.VITE_API_URL;
    const response = await fetch(`${api}/standards?standardId=${standardId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch standards');
    }
    const data = await response.json();
// Filter standards to include only those with matching standardId
const filteredStandards = data.filter((standard: any) => standard.standardId === standardId);

// Assuming data is an array of records, select the first one
const standardName = filteredStandards.length > 0 ? filteredStandards[0].standardName : '';

// Update state with the fetched standard name
setStandardName(standardName);

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

       {t('createIndicator')}

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
  </svg>Back</button>

  </div>

      {showForm && (
        
          <div className="modal-overlay">
            <div className="modal-content">
            <h1 style={{ fontWeight: 'bold', fontSize: '24px' }}>Create New Indicator</h1><br></br>
          
           
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{t('indicatorId')}</label>
              <input type="text" name="indicatorId" value={recordData.indicatorId} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 
                focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" style={{ width: '300px'}}/>
             
            </div><br />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{t('indicatorName')}</label>
              <input type="text" name="indicatorName" value={recordData.indicatorName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 
                focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
             
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


      <div>
      <div className="predefined-header">

        <h2>   {t('indicators')}</h2>
        <h6>  {t('findTemplates')}</h6>

      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
       
        {[...new Map(
          records
            .filter(record => record.status !== 'archived') // Filter based on documentURL and status
            .map(record => [record.indicatorId, record]) // Map each record to its standardName and the record itself
        )].map(([indicatorId, record], index) => (
          <div key={index} className="record">
           
            <div className="rounded-xl border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="scard-block">
          <div className="circle-background">
              <svg
                className="fill-primary dark:fill-white svg-icon"
                width="30"
                height="30"
                viewBox="0 0 22 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
            <path
              d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z"
              fill=""
            />
            <path
              d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
              fill=""
            />
            </svg>
            </div>

            <a href={`/EvidenceFiles/${record.indicatorId}`} className="link-unstyled">

    <h6 className="m-b-20">{indicatorId}</h6>
    <h5>{record.indicatorName}</h5></a>
    {isAdmin && (
        <>
     {/* Delete icon */}
     <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={() => handleDelete(record.description)} />
                        {/* Archive icon */}
                        <FontAwesomeIcon icon={faArchive} className="archive-icon" onClick={() => handleArchive(record.indicatorId)} />
                        </>
      )}       
      </div>
        </div>

          </div>
        ))}
      </div>
      </div>
    </DefaultLayout>
  );
};

export default PredefinedTemplate;
