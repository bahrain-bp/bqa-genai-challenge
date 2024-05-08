import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import React, { useState, useEffect } from 'react';
//import CoverOne from '../images/cover/cover-01.png';
//import userSix from '../images/user/user-06.png';
//import { Link } from 'react-router-dom';
//import CardDataStats from '../components/CardDataStats';

// Define a type for the expected file data
type FileData = {
  fileName: string;
  standardName: string;
  indicatorNumber: number;
  summary: string;
  strength: string;
  weakness: string;
  score: number;
  comments: string;
}
const summaryPage=() => {
    //standards?standardId=${standardId}
    const [fileData, setFileData] = useState<FileData | null>(null);
    const [loading, setLoading] = useState(false);


        const fetchFiles = async () => {
          // setLoading(true);

          try {
            const response = await fetch('https://66xzg471hh.execute-api.us-east-1.amazonaws.com/summarization/BusinessPlan.pdf');
            const data = await response.json();
            setFileData(data);

            // setStandards(Array.from(standardsMap.values()));
          } catch (error) {
            console.error('Error fetching files:', error);
           // toast.error(Error fetching standards: ${error.message});
          }
        };

        useEffect(() => {
          fetchFiles();
      }, []);
    
     

    return (
    <DefaultLayout>
      <Breadcrumb pageName="Summarized Evidence Page" />
      {/**File name  */}
      <div>
                {fileData ? (
                    <div>
                       
                        <p><strong>File Name:</strong> {fileData.fileName}</p>
                        <p><strong>Standard Name:</strong> {fileData.standardName}</p>
                        <p><strong>Indicator Number:</strong> {fileData.indicatorNumber}</p>
                        <p><strong>Summary:</strong> {fileData.summary}</p>
                     
                    </div>
                      ) : (
                        <p>No data found for the file.</p>
                    )}
                </div>
        </DefaultLayout>

    );


};
export default summaryPage;

