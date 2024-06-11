import React, {useState, useEffect } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import './PredefinedTemplate.css'; // Importing CSS file
import '@fortawesome/fontawesome-free/css/all.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faUndo } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify

const Archived: React.FC = () => {

  const { t } = useTranslation(); // Hook to access translation functions
   
  const handleArchiveStandard = async (standardId: string) => {
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
          body: JSON.stringify({ ...record, status: 'unarchived' }), // Update the status field to 'archived'
        });
        if (!response.ok) {
          throw new Error(`Failed to archive record with entityId: ${record.entityId}`);
        }
      }));
  
      // Fetch records again to reflect the changes
      fetchIndicatorRecords();
      fetchStandardRecords();
      console.log('Records archived successfully');
    } catch (error) {
      console.error('Error archiving records:', error);
    }
  };

  
  const handleArchiveIndicator = async (indicatorId: string) => {
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
          body: JSON.stringify({ ...record, status: 'unarchived' }), // Update the status field to 'archived'
        });
        if (!response.ok) {
          throw new Error(`Failed to archive record with entityId: ${record.entityId}`);
        }
      }));
  
      // Fetch records again to reflect the changes
      fetchIndicatorRecords();
      console.log('Records archived successfully');
    } catch (error) {
      console.error('Error archiving records:', error);
    }
  };

  
  const handleArchiveFiles = async (description: string) => {
    try {
      // Find the record with the matching comment
      const recordToArchive = records.find(record => record.description === description);
      if (!recordToArchive) {
        throw new Error('Record not found for the given comments');
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
        body: JSON.stringify({ ...recordToArchive, status: 'unarchived' }), // Update the status field to 'archived'
      });
      if (!response.ok) {
        throw new Error('Failed to archive record');
      }
  
      // Fetch records again to reflect the changes
      fetchFileRecords();
      console.log('Record archived successfully');
      toast.success('Records unarchived successfully');
      console.log('Record to be archived:', recordToArchive);

    } catch (error) {
      console.error('Error archiving record:', error);
    }
  };
  
  
  useEffect(() => {
    fetchFileRecords();
    fetchIndicatorRecords();
    fetchStandardRecords(); // Fetch records for the extracted standard name // Fetch records when the component mounts
  }, []);

  const [records, setRecords] = useState<any[]>([]); // Initialize state to store fetched records
  

  const fetchStandardRecords = async () => {
    try {
      const api = import.meta.env.VITE_API_URL;
      const response = await fetch(`${api}/standards`);
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      const data: any[] = await response.json(); // Assuming your records have type any
      
      // Sort records based on the numeric value in the standardId
      const sortedRecords = data
        .filter((record: any) => record.status == 'archived') // Filter based on  status
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

  const fetchIndicatorRecords = async () => {
    try {
      const api = import.meta.env.VITE_API_URL;
      const response = await fetch(`${api}/standards`);
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      const data: any[] = await response.json(); // Assuming your records have type any
      
      // Sort records based on the numeric value in the standardId
      const sortedRecords = data
        .filter((record: any) => record.description && record.status == 'archived') // Filter based on documentURL and status
        .sort((a: any, b: any) => {
          const indicatorIdA = parseInt(a.indicatorId.replace('Indicator', ''));
          const indicatorIdB = parseInt(b.indicatorId.replace('Indicator', ''));
          return indicatorIdA - indicatorIdB;
        });
      

      // // Filter records based on standardId
      // const filteredRecords = sortedRecords.filter((record: { standardId: string | undefined }) => record.standardId === standardId);

      setRecords(sortedRecords);
  
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const fetchFileRecords = async () => {
    try {
      // Constructing URL with standard name
      const api = import.meta.env.VITE_API_URL;
      const apiUrl = `${api}/standards`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      const data = await response.json();
      // // Filter records based on indicatorId
      // const filteredRecords = data.filter((record: { indicatorId: string | undefined }) => record.indicatorId === indicatorId);

      setRecords(data); // Update state with fetched records
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };


  return (
    <DefaultLayout>

      <div>
      <div className="predefined-header">
        <h2>{t('archivedStandards')}</h2>
      </div>
   
        {/* Get data from DB */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
       
       {[...new Map(
         records
           .filter(record => record.status == 'archived') // Filter based on status
           .map(record => [record.standardId, record]) // Map each record to its standardName and the record itself
       )].map(([standardId, record], index) => (
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
   <h5>{record.standardName}</h5></a>

      {/* Archive icon */}
                        <FontAwesomeIcon icon={faUndo} className="unarchive-icon" onClick={() => handleArchiveStandard(record.standardId)} />
                      
     </div>
       </div>

         </div>
       ))}
</div>
<div className="predefined-header">
        <h2>{t('archivedIndicators')}</h2>
          </div>
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
       
       {[...new Map(
         records
           .filter(record => record.description && record.status == 'archived') // Filter based on documentURL and status
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
{/* Archive icon */}
                       <FontAwesomeIcon icon={faUndo} className="unarchive-icon" onClick={() => handleArchiveIndicator(record.indicatorId)} />
                
     </div>
       </div>

         </div>
       ))}
     </div>
     <div className="predefined-header">
        <h2>{t('archivedFiles')}</h2>
          </div>
     {records
        .filter(record => record.description && record.status == 'archived') // Filter based on documentURL and status
        .map((record, index) => {

          return (
            <div key={index} className="record">
              <div className="container">
              <div className="d-flex justify-content-center">
              <div className="card rounded-xl border border-stroke bg-white shadow-default border-info">
              <div className="card-body py-4 px-5">
                          <div className="d-flex align-items-center">
                            <div>
                               <p className="mb-0 font-13" style={{ fontWeight: 'normal' }}>{record.description}</p>
                            </div>
                          </div>
                       {/* Archive icon */}
                        <FontAwesomeIcon icon={faUndo} className="unarchive-icon" onClick={() => handleArchiveFiles(record.description)} />
                      </div>
                    </div>
                
                </div>
              </div>
            </div>
          );
        })}
    </div>
         
       
    </DefaultLayout>
  );
};

export default Archived;
