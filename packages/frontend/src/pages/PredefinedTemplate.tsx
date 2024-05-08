import React, { useState, useEffect } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import './PredefinedTemplate.css'; // Importing CSS file
import '@fortawesome/fontawesome-free/css/all.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faArchive } from '@fortawesome/free-solid-svg-icons';
import Loader from '../common/Loader';
import {fetchUserAttributes } from 'aws-amplify/auth';



import { useTranslation } from 'react-i18next';


//INDICATORS FILE **


const PredefinedTemplate: React.FC = () => {
 // Get the standardId from the URL
const standardId = window.location.pathname.split('/').pop();
const { t } = useTranslation(); // Hook to access translation functions
    

// Set the value of the input field if it exists
const inputElement = document.querySelector<HTMLInputElement>('input[name="standardId"]');
if (inputElement) {
    inputElement.value = standardId ?? '';
}

const [showForm, setShowForm] = useState(false); // State variable to toggle form visibility
const [standardName, setStandardName] = useState('');
// const [standardName, setStandardName] = useState<any[]>([]);
const [indicators, setIndicators] = useState<any[]>([]); // State variable to store indicators
const [isAdmin, setIsAdmin] = useState<boolean>(false);
const [/*currentName*/, setCurrentName] = useState('');


  const [recordData, setRecordData] = useState({
    entityType: '',
    entityId: '',
    standardName: '',
    indicatorId: '',
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
      // Fetch records with the matching standardId
      const recordsToDelete = records.filter(record => record.indicatorId === indicatorId);
      if (recordsToDelete.length === 0) {
        throw new Error('No records found for the given standardId');
      }
  
      // Delete each record
      await Promise.all(recordsToDelete.map(async record => {
        const apiUrl = `https://tds1ye78fl.execute-api.us-east-1.amazonaws.com/standards/${record.entityId}`;
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
    } catch (error) {
      console.error('Error deleting records:', error);
    }
  };
  

  const handleArchive = async (indicatorId: string) => {
    try {
      // Fetch records with the matching standardId
      const recordsToArchive = records.filter(record => record.indicatorId === indicatorId);
      if (recordsToArchive.length === 0) {
        throw new Error('No records found for the given standardId');
      }
  
      // Update status to 'archived' for each record
      await Promise.all(recordsToArchive.map(async record => {
        const apiUrl = `https://tds1ye78fl.execute-api.us-east-1.amazonaws.com/standards/${record.entityId}`;
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
      console.log('Records archived successfully');
    } catch (error) {
      console.error('Error archiving records:', error);
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
      const standardId = window.location.pathname.split('/').pop();
  
      // Handle file upload
      const selectedStandard = `${standardId}/${recordData.indicatorId}`;// Get the selected standard value
      await handleFileSelect(file, selectedStandard);
  
      // Create record in DynamoDB
      const documentURL = `https://d2qvr68pyo44tt.cloudfront.net/${selectedStandard}/${file.name}`;
      const newRecordData = {
        ...recordData,
        documentName: file.name,
        documentURL,
        standardId: standardId, // Ensure standardId is included in the record data
        standardName: standardName // Include standardName in recordData
      };
      const response = await fetch('https://tds1ye78fl.execute-api.us-east-1.amazonaws.com/standards', {
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
      fetchRecords(standardId); // Fetch records for the extracted standard name
      setRecordData({
        entityType: '',
        entityId: '',
        standardName: '',
        indicatorId: '',
        indicatorName: '',
        description: '',
        documentName: '',
        documentURL: '',
        dateCreated: '',
        status: 'unarchived',
      });
      alert('Record created successfully!');
    } catch (error) {
      console.error('Error creating record:', error);
      alert('Failed to create record');
    }
  };

  const fetchIndicators = async (standardId: string | undefined) => {
    try {
      const response = await fetch(`https://tds1ye78fl.execute-api.us-east-1.amazonaws.com/standards?standardId=${standardId}`);
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
      const response = await fetch(`https://tds1ye78fl.execute-api.us-east-1.amazonaws.com/standards?standard=${standardId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      const data: any[] = await response.json(); // Assuming your records have type any
      
      // Sort records based on the numeric value in the standardId
      const sortedRecords = data
        .filter((record: any) => record.documentURL && record.status !== 'archived') // Filter based on documentURL and status
        .sort((a: any, b: any) => {
          const indicatorIdA = parseInt(a.indicatorId.replace('Indicator', ''));
          const indicatorIdB = parseInt(b.indicatorId.replace('Indicator', ''));
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
            alert('File uploaded successfully!');
          })
          .catch(error => {
            console.error('Error uploading file:', error);

            // alert('Failed to upload file');

            alert('Failed to upload file!');

          });
      }
    };
  
    fileReader.readAsBinaryString(file);
  }

const fetchStandardName = async (standardId: string | undefined) => {
  try {
    // Make API call to fetch standard name based on standardId
    const response = await fetch(`https://tds1ye78fl.execute-api.us-east-1.amazonaws.com/standards?standardId=${standardId}`);
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
            <div className="form-group">

              <label>  {t('chooseIndicator')}</label>


              <select name="indicatorId" value={recordData.indicatorId} onChange={handleChange} className="white-background" >
              
                <option value="">{t('selectIndicator')}</option>
                {indicators.map((indicator: any) => (
                  <option key={indicator.indicatorId} value={indicator.indicatorId}>
                    {`${indicator.indicatorId}: ${indicator.indicatorName}`}
                  </option>
                ))}

             {[...new Set(indicators.map((indicator: any) => indicator.indicatorId))]
  .sort((a, b) => a - b)
  .map((indicatorId: any) => {
    const indicator = indicators.find((indicator: any) => indicator.indicatorId === indicatorId);
    return (
      <option key={indicator.indicatorId} value={indicator.indicatorId}>
        {`${indicator.indicatorId}: ${indicator.indicatorName}`}
      </option>
    );
  })}

              </select>
            </div><br />

            <div className="form-group">

              <label>{t('indicatorName')}</label>
              <input type="text" name="indicatorName" value={recordData.indicatorName} onChange={handleChange} className="white-background" />
            </div><br />
            <div className="form-group">
              <label>{t('indicatorId')}</label>
              <input type="text" name="indicatorId" value={recordData.indicatorId} onChange={handleChange} className="white-background" />
            </div><br />
            <div className="form-group">
              <label>{t('uploadDocument')}</label>
              <input type="file" name="documentName" value={recordData.documentName} onChange={handleChange} className="white-background" />
            </div><br />
            <div className="form-group">
              <label>{t('documentDescription')}</label>
              <input type="text" name="description" value={recordData.description} onChange={handleChange} className="white-background" />
            </div><br />
            <div className="form-group">
              <label>{t('status')}</label>
              <input type="text" name="status" value={recordData.status} onChange={handleChange} className="white-background" readOnly />
            </div><br />
            <div className="form-buttons">
            <button
        className="flex rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white mr-4"
        type="button"
        onClick={handleCancel}
      >

        {t('cancel')}


      </button>
      <button
        className={`flex rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90 mr-4`}
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
            .filter(record => record.documentURL && record.status !== 'archived') // Filter based on documentURL and status
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

       {/* Delete icon */}
       <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={() => handleDelete(record.indicatorId)} />
                        {/* Archive icon */}
                        <FontAwesomeIcon icon={faArchive} className="archive-icon" onClick={() => handleArchive(record.indicatorId)} />
                 
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
