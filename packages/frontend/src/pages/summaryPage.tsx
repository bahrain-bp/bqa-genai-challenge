import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


// import { useParams } from 'react-router-dom';

// Define a type for the expected file data
// type FileData = {
//   fileName: string;
//   standardName: string;
//   indicatorNumber: number;
//   summary: string;
//   strength: string;
//   weakness: string;
//   score: number;
//   comments: string;
// }
const SummaryPage = () => {
  //standards?standardId=${standardId}
  // const { fileName } = useParams<{ fileName: string }>();
  const [fileData, setFileData] = useState<any | null>(null);
  const [loading, /*setLoading*/] = useState(false);
  const apiURL = import.meta.env.VITE_API_URL;
  const location = useLocation();
  // Extract the fileName from the state object
  const fileName = location.state && location.state.fileName;
  
  
  
  
    const navigate = useNavigate();
  
    const goBack = () => {
      navigate(-1); // Moves one step back in the browser's history stack
    };

    // const handlePrint = () => {
    //   window.print();
    // };
  
  




  const fetchFiles = async () => {
    // setLoading(true);
//return the apiURL
     // Changed the apiurl to prod //u1oaj2omi2
      // const response = await fetch('https://66xzg471hh.execute-api.us-east-1.amazonaws.com/summarization/BusinessPlan.pdf');
      const url = `${apiURL}/summarization`;
    try {
        const response = await axios.get(url, {
            headers: {
                'file-name': fileName // Sending fileName in headers
            }
        });
        console.log('Response:', response.data);
        setFileData(response.data);
        return response.data;
        
    } catch (error:any) {
        console.error('Error fetching file summary:', error.message);
        return null;
    }
}
  console.log(fileData);
  useEffect(() => {
    fetchFiles();
  }, []);
  // useEffect(() => {
  //   if (fileName) {
  //     fetchFiles();
  //   }
  // }, [fileName]);

  return (
    <DefaultLayout>
<button onClick={goBack} style={{
  padding: '8px 16px',
  //backgroundColor: '#3c50e0',
  color: 'black',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: ''
}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}>
    <path fillRule="evenodd" d="M15 8a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708.708L2.707 7.5H14.5A.5.5 0 0 1 15 8z"/>
  </svg>Back</button>

    
      <Breadcrumb pageName="Summarized Evidence Page" />

      {/**File name  */}
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : fileData ? (
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            {/* <p><strong>File Name:</strong> {fileData.fileName}</p> */}
            {/* <p><strong>Standard Name:</strong> {fileData.standardName}</p> */}
            {/* <p><strong>Indicator Number:</strong> {fileData.indicatorNumber}</p> */}
            {/* <p><strong>Summary:</strong> {fileData.summary}</p> */}

            <div className="mb-5 flex flex-col gap-5 sm:flex-row ml-3 mr-3 px-7 ">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 mt-4 block text-sm font-medium text-black dark:text-white"
                  htmlFor="fullName"
                >
                  File Name
                </label>
                <input
                  // className="w-full h-auto min-h-[150px] resize-y rounded border border-stroke bg-gray-100 py-3 pl-4 pr-4 text-black
                  // focus:border-primary focus-visible:outline-none dark:border-stroke-dark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  //                           className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary "
                  // className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={fileName}
                  disabled
                ></input>
              </div>

              {/* <h3 className="font-medium text-black dark:text-white">
                 File Name: {fileData.fileName}
                </h3> */}
              {/* </div> */}
              {/* <div className="border-b border-stroke py-4 px-7 dark:border-strokedark"> */}
              {/* <h3 className="font-medium text-black dark:text-white">
                Standard Name :  {fileData.standardName}
                </h3> */}
              {/* </div> */}
              {/* <div className="border-b border-stroke py-4 px-7 dark:border-strokedark"> */}
              {/* <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 mt-4 block text-sm font-medium text-black dark:text-white"
                  htmlFor="fullName"
                >
                  Standard Number
                </label>
                <input
                  // className="w-full h-auto min-h-[150px] resize-y rounded border border-stroke bg-gray-100 py-3 pl-4 pr-4 text-black
                  // focus:border-primary focus-visible:outline-none dark:border-stroke-dark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  //                           className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary "
                  // className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={fileData.standardNumber}
                  disabled
                ></input>
              </div> */}

              {/* <div className="border-b border-stroke py-4 px-7 dark:border-strokedark"> */}
            {/* </div>

            <div className="mb-5 flex flex-col gap-5 sm:flex-row ml-3 mr-3 px-7 ">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 mt-4 block text-sm font-medium text-black dark:text-white"
                  htmlFor="fullName"
                >
                  Indicator Number
                </label>
                <input
                  
                  className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary "
                  placeholder={fileData.indicatorNumber}
                  disabled
                ></input>
              </div> */}

            
            </div>

           
            <div className=" py-4 px-7">
              <label
                className="mb-3 mt-4 block text-sm font-medium text-black dark:text-white"
                htmlFor="fullName"
              >
                Summary
              </label>
              <div
                // className="w-full h-auto min-h-[150px] resize-y rounded border border-stroke bg-gray-100 py-3 pl-4 pr-4 text-black
                // focus:border-primary focus-visible:outline-none dark:border-stroke-dark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                //                           className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary "
                // className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {fileData.summary}
              </div>
              {/* <button onClick={handlePrint}>Print Summary</button> */}

            </div>

            {/* <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">

              <div 
// className="w-full h-auto min-h-[150px] resize-y rounded border border-stroke bg-gray-100 py-3 pl-4 pr-4 text-black 
// focus:border-primary focus-visible:outline-none dark:border-stroke-dark dark:bg-meta-4 dark:text-white dark:focus:border-primary"        
className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"              
                     >
                         {fileData.summary} 
                      </div>
                      </div> */}
          </div>
        ) : (
          <p>No data found for the file.</p>
        )}
      </div>
    </DefaultLayout>
  );
};
export default SummaryPage;
