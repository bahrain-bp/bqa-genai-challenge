// import React, { useEffect, useState } from 'react';
// import DefaultLayout from '../layout/DefaultLayout';
// import './PredefinedTemplate.css';
// import '@fortawesome/fontawesome-free/css/all.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrash, faArchive } from '@fortawesome/free-solid-svg-icons';

// const EvidenceFiles: React.FC = () => {
//   const [records, setRecords] = useState<any[]>([]);

//   const fetchRecords = async (standardName: string | undefined) => {
//     try {
//       // Constructing URL with standard name
//       const apiUrl = `https://tds1ye78fl.execute-api.us-east-1.amazonaws.com/standards?standard=${standardName}`;

//       const response = await fetch(apiUrl);
//       if (!response.ok) {
//         throw new Error('Failed to fetch records');
//       }
//       const data = await response.json();
//       // Filter records based on standardName
//       const filteredRecords = data.filter((record: { standardName: string | undefined }) => record.standardName === standardName);

//       setRecords(filteredRecords); // Update state with fetched records
//     } catch (error) {
//       console.error('Error fetching records:', error);
//     }
//   };

//   const handleDelete = async (documentURL: string) => {
//     try {
//       // Find the record with the matching documentURL
//       const recordToDelete = records.find(record => record.documentURL === documentURL);
//       if (!recordToDelete) {
//         throw new Error('Record not found for the given document URL');
//       }
  
//       const apiUrl = `https://tds1ye78fl.execute-api.us-east-1.amazonaws.com/standards/${recordToDelete.entityId}`;
//       const response = await fetch(apiUrl, {
//         method: 'DELETE',
//       });
//       if (!response.ok) {
//         throw new Error('Failed to delete record');
//       }
  
//       // Remove the deleted record from the state
//       setRecords(records.filter(record => record.entityId !== recordToDelete.entityId));
//       console.log('Record deleted successfully');
//     } catch (error) {
//       console.error('Error deleting record:', error);
//     }
//   };

//   const handleArchive = async (documentURL: string) => {
//     try {
//       // Find the record with the matching documentURL
//       const recordToArchive = records.find(record => record.documentURL === documentURL);
//       if (!recordToArchive) {
//         throw new Error('Record not found for the given document URL');
//       }
//           // Print the record to be updated in the console
//     console.log('Record to be archived:', recordToArchive);

  
//       const apiUrl = `https://tds1ye78fl.execute-api.us-east-1.amazonaws.com/standards/${recordToArchive.entityId}`;
//       const response = await fetch(apiUrl, {
//         method: 'PUT', // Use PUT method to update the record
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ ...recordToArchive, status: 'archived' }), // Update the status field to 'archived'
//       });
//       if (!response.ok) {
//         throw new Error('Failed to archive record');
//       }
  
//       // Fetch records again to reflect the changes
//       fetchRecords(recordToArchive.standardName);
//       console.log('Record archived successfully');
//       console.log('Record to be archived:', recordToArchive);

//     } catch (error) {
//       console.error('Error archiving record:', error);
//     }
//   };
  

//   useEffect(() => {
//     // Extracting standard name from the URL
//     const standardName = window.location.pathname.split('/').pop();
//     fetchRecords(standardName); // Fetch records for the extracted standard name
//   }, []);

//   return (
//     <DefaultLayout>
     
//      <div className="download-header">
//         <h2>Download Files</h2>
//         <h6></h6>
//       </div>
//       {records
//         .filter(record => record.documentURL && record.status !== 'archived') // Filter based on documentURL and status
//         .map((record, index) => {
//           // Extracting document name from the URL
//           const urlParts = record.documentURL.split('/');
//           const documentName = urlParts[urlParts.length - 1];

//           return (
//             <div key={index} className="record">
//               <div className="container">
//               <div className="d-flex justify-content-center">
//               <div className="card rounded-xl border border-stroke bg-white shadow-default border-info">
//               <div className="card-body py-4 px-5">
//                         <a href={record.documentURL} className="link-unstyled">
//                           <div className="d-flex align-items-center">
//                             <div>
//                               <h4 className="my-1 text-info">{documentName}</h4>
//                               <p className="mb-0 font-13" style={{ fontWeight: 'normal' }}>{record.description}</p>
//                             </div>
//                           </div>
//                         </a>
//                         {/* Delete icon */}
//                         <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={() => handleDelete(record.documentURL)} />
//                         {/* Archive icon */}
//                         <FontAwesomeIcon icon={faArchive} className="archive-icon" onClick={() => handleArchive(record.documentURL)} />
//                       </div>
//                     </div>
                
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//     </DefaultLayout>
//   );
// };

// export default EvidenceFiles;
