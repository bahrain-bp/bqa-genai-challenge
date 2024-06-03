import React, {useState, useEffect } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import './PredefinedTemplate.css'; // Importing CSS file
import '@fortawesome/fontawesome-free/css/all.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faArchive } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import {fetchUserAttributes } from 'aws-amplify/auth';
import Loader from '../common/Loader';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify

const Standards: React.FC = () => {

  const [showForm, setShowForm] = useState(false); // State variable to toggle form visibility
  const { t } = useTranslation(); // Hook to access translation functions
     const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [/*currentName*/, setCurrentName] = useState('');
  const [loading, setLoading] = useState<boolean>(true);

  const handleDelete = async (standardId: string) => {
    try {
      // Define the confirmation dialog options
      const confirmationOptions = {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this standard?',
        buttons: [
          {
            label: 'Yes',
            onClick: async () => {
              try {
                // Fetch records with the matching standardId
                const recordsToDelete = records.filter(record => record.standardId === standardId);
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
                console.log('Records deleted successfully');
                toast.success('Records deleted successfully');
              }catch (error) {
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
  
  const handleArchive = async (standardId: string) => {
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
                // Fetch records with the matching standardId
                const recordsToArchive = records.filter(record => record.standardId === standardId);
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
                fetchRecords();
                toast.success('Records archived successfully');
              }catch (error) {
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




  useEffect(() => {
   
    fetchRecords(); // Fetch records for the extracted standard name // Fetch records when the component mounts
  }, []);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
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

  const [records, setRecords] = useState<any[]>([]); // Initialize state to store fetched records
  
  const [recordData, setRecordData] = useState({
    entityType: '',
    entityId: '',
    standardId: '',
    standardName: '',
    indicatorId: '',
    indicatorName: '',
    description: '',
    documentName: '',
    documentURL: '', // Initialize documentURL state
    dateCreated: '',
    status: 'unarchived',
  });

  const fetchRecords = async () => {
    try {
      const api = import.meta.env.VITE_API_URL;
      const response = await fetch(`${api}/standards`);
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      const data: any[] = await response.json(); // Assuming your records have type any
      
      // Sort records based on the numeric value in the standardId
      const sortedRecords = data
        .filter((record: any) => record.status !== 'archived') // Filter based on  status
        .sort((a: any, b: any) => {
          const standardIdA = parseInt(a.standardId.replace('Standard', ''));
          const standardIdB = parseInt(b.standardId.replace('Standard', ''));
          return standardIdA - standardIdB;
        });
      
     setRecords(sortedRecords); // Update state with sorted records
  
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };


  const createRecord = async () => {
    try {
  
      // Create record in DynamoDB
       const newRecordData = {
        ...recordData,
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
        throw new Error('Failed to create Standard');
      }
      const data = await response.json();
      console.log('New Standard created:', data);
      setShowForm(false);
      fetchRecords(); // Fetch records for the extracted standard name
      setRecordData({
        entityType: '',
        entityId: '',
        standardId: '',
        standardName: '',
        indicatorId: '',
        indicatorName: '',
        description: '',
        documentName: '',
        documentURL: '',
        dateCreated: '',
        status: 'unarchived',
      });
      toast.success('Standard created successfully');

    } catch (error) {
      console.error('Error creating Standard:', error);
      toast.error('Failed to create Standard');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = event.target;
  
    // Trim any spaces from the value if the field name is 'standardId'
    const trimmedValue = name === 'standardId' ? value.trim() : value;
  
    setRecordData(prevState => ({
      ...prevState,
      [name]: trimmedValue,
    }));
  };
  

  
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleCancel = () => {
    setShowForm(false);
    // Reset recordData if needed
  };
  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
{/*Until here  */}
{isAdmin?(       
   <div>
        <div className="button-container1">
          <button
            className={`flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90 mr-4`}
            type="button" // Change type to "button"
            onClick={toggleForm} // Add onClick handler
          >
            {t('createNewStandard')}
          </button>
        </div>
        {showForm && (
          
          <div className="modal-overlay">
            <div className="modal-content">
            <h1 style={{ fontWeight: 'bold', fontSize: '24px' }}>Create New Standard</h1><br></br>
          
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700"> {t('standardId')}</label>
                <input type="text"  placeholder="Enter new standardId"  name="standardId" value={recordData.standardId} onChange={handleChange}  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
 />
              </div>
              <br />
              <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700"> {t('standardName')}</label>
                <input type="text"  placeholder="Enter new standardName" name="standardName" value={recordData.standardName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 
                focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <br />
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
):null}
{/*Until here  */}

      <div>
        <div className="predefined-header">
          <h2>{t('predefinedTemplates')}</h2>
          <h6>{t('predefinedTemplateDesc')}</h6>
        </div>
        {/* Get data from DB */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          {[
            ...new Map(
              records
                .filter(record => record.status !== 'archived') // Filter based on status
                .map(record => [record.standardId, record]) // Map each record to its standardName and the record itself
            ),
          ].map(([standardId, record], index) => (
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
                  <a href={`PredefinedTemplate/${record.standardId}`} className="link-unstyled">
                    <h6 className="m-b-20">{standardId}</h6>
                    <h5>{record.standardName}</h5>
                  </a>
                  {isAdmin && (
                    <>
                  {/* Delete icon */}
                  <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={() => handleDelete(record.standardId)} />
                  {/* Archive icon */}
                  <FontAwesomeIcon icon={faArchive} className="archive-icon" onClick={() => handleArchive(record.standardId)} />
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

export default Standards;