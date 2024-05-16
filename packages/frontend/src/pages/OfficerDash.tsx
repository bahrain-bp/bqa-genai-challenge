import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
//import CoverOne from '../images/cover/cover-01.png';
//import userSix from '../images/user/user-06.png';
//import { Link } from 'react-router-dom';
//import CardDataStats from '../components/CardDataStats';
// import { Package } from '../types/package';
import ChartThree from '../components/Charts/ChartThree';
// import ChartTwo from '../components/Charts/ChartTwo';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Loader from '../common/Loader';
import  {  useEffect,useState } from 'react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { toast } from 'react-toastify';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
 import axios from 'axios';

import {
  FormControl,
  InputLabel,
  TextField,
  MenuItem,
  Select,
} from '@mui/material';

type FileDetail = {
  key: string;
  name: string;
 
};
// const options: ApexOptions = {
//   colors: ['#3C50E0', '#80CAEE'],
//   chart: {
//     fontFamily: 'Satoshi, sans-serif',
//     type: 'bar',
//     height: 335,
//     stacked: true,
//     toolbar: {
//       show: false,
//     },
//     zoom: {
//       enabled: false,
//     },
//   },

//   responsive: [
//     {
//       breakpoint: 1536,
//       options: {
//         plotOptions: {
//           bar: {
//             borderRadius: 0,
//             columnWidth: '25%',
//           },
//         },
//       },
//     },
//   ],
//   plotOptions: {
//     bar: {
//       horizontal: false,
//       borderRadius: 0,
//       columnWidth: '25%',
//       borderRadiusApplication: 'end',
//       borderRadiusWhenStacked: 'last',
//     },
//   },
//   dataLabels: {
//     enabled: false,
//   },

//   xaxis: {
//     categories: records.map(record => record.standardId),
//   },
//   legend: {
//     position: 'top',
//     horizontalAlign: 'left',
//     fontFamily: 'Satoshi',
//     fontWeight: 500,
//     fontSize: '14px',

//     markers: {
//       radius: 99,
//     },
//   },
//   fill: {
//     opacity: 1,
//   },
// };

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}
// Type definitions
interface Record {
  standardId: string;
  standardName: string;
  status: string;
}


// const packageData: Package[] = [
//     {
//       name: 'File 1.ppt',
//       invoiceDate: `Jan 13,2023`,
//       size:'56 MB',
//       status: 'Completed',
//     },

//   ];


const OfficerDash = () => {
  const { t } = useTranslation(); // Hook to access translation functions
    
  const [currentName, setCurrentName] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  //const [files, setFiles] = useState({});
  const [files, setFiles] = useState<FileDetail[]>([]);
  // const [files, setFiles] = useState<any[]>([]);
  const [standards, setStandards] = useState<any[]>([]); // Using 'any[]' for state typing
  const [isDownloading, setIsDownloading] = useState(false);
  const apiURL = import.meta.env.VITE_API_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [records, setRecords] = useState<Record[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndicator, setSelectedIndicator] = useState('');



  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const options: ApexOptions = {
    colors: ['#3C50E0', '#80CAEE'],
   
    chart: {
      events: {
        click: function(event, chartContext, { dataPointIndex }) {
          const selectedStandardId = records[dataPointIndex].standardId;
          fetchUploadedFiles(selectedStandardId); // Function to fetch files based on standardId
        }
  
      },
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 335,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
  
    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 0,
              columnWidth: '25%',
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: '25%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: {
      enabled: false,
    },
  
    xaxis: {
      categories: records.map(record => record.standardId)
      
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Satoshi',
      fontWeight: 500,
      fontSize: '14px',
  
      markers: {
        radius: 99,
      },
    },
    fill: {
      opacity: 1,
    },
  };

      const fetchCurrentUserInfo = async () => {
        try {
          const attributes = await fetchUserAttributes();
          const name:any= attributes.name;
         
          setCurrentName(name);
          console.log(name);
           // Call to fetch files after successful fetching of user name
      // if (name) {
      //   await fetchUploadedFiles(name);
      // }
  
        } catch (error) {
          console.error('Error fetching current user info:', error);
        }
      };
      useEffect(() => {
        fetchCurrentUserInfo();
      }, []);

      //fetch uploaded folders TRY#1
      const fetchRecords = async () => {
        try {
          // const api = import.meta.env.VITE_API_URL;
          const response = await fetch(`https://tds1ye78fl.execute-api.us-east-1.amazonaws.com/standards`);
          if (!response.ok) {
            throw new Error('Failed to fetch records');
          }
          const data = await response.json();

          const recordMap = new Map();
          data.forEach((item: Record) => {
            if (item.status !== 'archived' && !recordMap.has(item.standardId)) {
              recordMap.set(item.standardId, item);
            }
          });
          const uniqueRecords = Array.from(recordMap.values());
          setRecords(uniqueRecords);
        //    setChartData({
        //   series: [{
        //     name: 'Standard',
        //     data: uniqueRecords.map(item => item.fileCount) // Assuming you have fileCount
        //   }]
        // });
          setLoading(false);; // Update state with sorted records
         console.log("Records "+setRecords);
      
        } catch (error) {
          console.error('Error fetching records:', error);
        }
      };
      useEffect(() => {
   
        fetchRecords(); // Fetch records for the extracted standard name // Fetch records when the component mounts
      }, []);
      // useEffect(() => {
      //   const fetchStandards = async () => {
      //     try {
      //       const response = await fetch(
      //         `https://tds1ye78fl.execute-api.us-east-1.amazonaws.com/standards`,
      //       );
      //       if (!response.ok) {
      //         throw new Error(`HTTP status ${response.status}`);
      //       }
      //       const rawData = await response.json();
      //       const standardsMap = new Map();
      //       rawData.forEach((item: any) => {
      //         if (item.status == 'unarchived') {
      //           if (!standardsMap.has(item.standardId)) {
      //             standardsMap.set(item.standardId, { ...item, indicators: [] });
      //           }
      //           // standardsMap.get(item.standardId).indicators.push({
      //           //   label: item.indicatorName,
      //           //   uploadSection: item.uploadSection,
      //           //   id: item.indicatorId,
      //           // });
      //         }
      //       });
      //       setStandards(Array.from(standardsMap.values()));
      //       console.log("Standardzzz"+ standards);
      //       console.log("Standardzzz raw dat"+ rawData);
      //       console.log("Standardzz"+ standardsMap);


      //     } catch (error) {
      //       // Check if error is an instance of Error
      //       if (error instanceof Error) {
      //         console.error('Error fetching standards:', error);
      //         toast.error(`Error fetching standards: ${error.message}`);
      //       } else {
      //         // Handle cases where error is not an Error instance
      //         console.error('An unexpected error occurred:', error);
      //         toast.error('An unexpected error occurred');
      //       }
      //     }
      //   };
    
      //   fetchStandards();
      // }, []);




      const fetchUploadedFiles = async (standardId: string) => {
          const url = `${apiURL}/files`;
          try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'bucket-name': 'uni-artifacts',
                    'folder-name': currentName,
                     'subfolder-name':standardId,
                    // 'subsubfolder-name':'Indicator7'
                },
            });

      if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json(); 

      if (data.files && Array.isArray(data.files)) {
      const fetchedFiles: FileDetail[] = data.files.map((file: any) => ({
        key: file.Key,
        name: file.Key.split('/').pop(),
      }));

      setFiles(fetchedFiles);
      console.log("Fetched files:", fetchedFiles);
      //const indicators = [...new Set(files.map((file) => file.Key.split('/')[2]))];
      const indicators = [...new Set(fetchedFiles.map((file) => file.key.split('/')[2]))];
      setIndicators(indicators); // Make sure you have `setIndicators` defined in your state
    } else {
      console.error('Expected files to be an array but got:', data.files);
      setFiles([]); // Reset or handle as needed if data is not in the expected format
    }
//       // const files = data.files; // Ensure this matches the structure you log in Lambda
//       // const fetchedFiles = files.map(file => ({
//       //   key: file.name,
//       //   name: file.name.split('/').pop()
//       // }));
      
//       // files.map(file => ({ name: file.Key }))
//          // size: 'Unknown',  Example placeholder
//          // status: 'Completed',  Example placeholder
//          // date:'unknown',  Example placeholder
//       // }));


      setLoading(false);

//       // setUploadedFiles(prev => ({
//       //     ...prev,
//       //     [currentStandard.standardId]: files.map(file => ({ name: file.Key }))
//       // }));
  } catch (error:any) {
      console.error('Error fetching uploaded files:', error);
      // toast.error(`Error fetching uploaded files: ${error.message}`);
  }
};
useEffect(() => {
  fetchUploadedFiles("Standard1");
}, []);



const handleButtonClick = async (fileKey: any) => {
  setIsDownloading(true);
  toast('Downloading file');

  try {
    // Construct the API endpoint URL
    const apiCall = `${apiURL}/downloadFile`;

    // Encode the fileKey as a URL parameter
    const params = new URLSearchParams();
    params.append('data', JSON.stringify({ fileKey }));

    // Append the encoded parameters to the API endpoint URL
    const urlWithParams = `${apiCall}?${params.toString()}`;

    // Send the GET request using Axios
    const response = await axios.get(urlWithParams, {
      responseType: 'blob', // Set response type to 'blob' to receive binary data
    });

    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(response.data);
    // Create a link element and trigger a click to download the file
    const a = document.createElement('a');
    a.href = url;
    a.download = fileKey; // Set the filename
    a.click();
    // Clean up
    window.URL.revokeObjectURL(url);
    setIsDownloading(false);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    toast.error('Failed to download file');
    setIsDownloading(false);
  }
};
 //use /files enpoint to fetch uni files --pass uniName/Standard selected
//  useEffect(() => {
//   const fetchUploadedFiles = async () => {
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_URL}/files`,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'bucket-name': 'uni-artifacts',
//             'folder-name': currentName,
//             'subfolder-name': 'Standard2',

//             // 'subfolder-name': standard.replace(/\s/g, ''),
//           },
//         },
//       );
//       let filteredFiles = response.data.files;
//       console.log('Filtered files:'+ filteredFiles) ;
//       console.log('ceck:'+ filteredFiles.key) ;


      // // Filter based on search term
      // if (searchTerm.trim() !== '') {
      //   filteredFiles = filteredFiles.filter((file: any) =>
      //     file.Key.toLowerCase().includes(searchTerm.toLowerCase()),
      //   );
      // }

      // // Filter based on selected indicator
      // if (selectedIndicator !== '') {
      //   filteredFiles = filteredFiles.filter((file: any) =>
      //     file.Key.includes(selectedIndicator),
      //   );
      // }

//       setFiles(filteredFiles);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       // Handle error
//     }
//   };
//   fetchUploadedFiles();
// }, [/*standard, searchTerm, selectedIndicator,*/ currentName]);
// const indexOfLastItem = currentPage * itemsPerPage;
// const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// const currentFiles = files.slice(indexOfFirstItem, indexOfLastItem);

    
//Chart 

// Filtering files based on the selected indicator
const filteredFiles = files.filter(file => {
  return (
      (selectedIndicator === '' || file.key.includes(selectedIndicator)) &&
      (searchTerm === '' || file.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
});

const [state, setState] = useState<ChartTwoState>({
  series: [
    {
      name: 'Standard',
      data: [1,5,7,8,9 ], //this would be number of files in each standard
    },
    //{
      //name: 'Revenue',
      //data: [13, 23, 20, 8, 13, 27, 15,12,32],
    //},
  ],
});
const [loadings, setLoadings] = useState<boolean>(true);
useEffect(() => {
  setTimeout(() => setLoadings(false), 1000);
}, []);

const handleReset = () => {
  setState((prevState) => ({
    ...prevState,
  }));
};
handleReset;  
const [indicators, setIndicators] = useState<string[]>([]);


  return  (
    
    <DefaultLayout>

      {loading && (
    <Loader /> 
    )}
        
      <Breadcrumb pageName=  {t('universityOfficerDashboard')} />


      <div className="grid grid-cols-9 gap-4 md:gap-6 2xl:gap-7.5 sm:px-7.5 xl:pb-1">
       
       
        {/* <ChartTwo /> */}
    
        <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Standards Progress
          </h4>
        </div>
        <div>

        {/*    
          <div className="relative z-20 inline-block">

            
            <select
              name="#"
              id="#"
              className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
            >
              <option value="" className='dark:bg-boxdark'>This Week</option>
              <option value="" className='dark:bg-boxdark'>Last Week</option>
            </select>
            

            <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                  fill="#637381"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z"
                  fill="#637381"
                />
              </svg>
            </span>
          </div>

        */}

        </div>
      </div>

      <div>
      {loadings ? (
      <Loader />
    ) : (
      <div id="chartTwo" className="-ml-5 -mb-8">
        <ReactApexChart
          options={options}
          series={state.series}
          type="bar"
          height={350}
        />
      </div>
    )}

      </div>
    </div>

{/* End of chart 2 */}
        <ChartThree />
        </div>

        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark sm:px-7.5 x1:pb-1">
              <div className="flex justify-between mb-4">
                <TextField
                  label="Search by File Name"
                  variant="outlined"
                  size="small"
                  style={{ width: '69%' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} // Update search term state
                />
                <FormControl
                  variant="outlined"
                  size="small"
                  style={{ width: '29%' }}
                >
                  <InputLabel>Indicator</InputLabel>
                  <Select
                    value={selectedIndicator}
                    onChange={(e) => setSelectedIndicator(e.target.value)}
                    label="Indicator"
                  >
                    <MenuItem value="">All</MenuItem>
                    {indicators.map((indicator:any, index:any) => (
                      <MenuItem key={index} value={indicator}>
                        {indicator}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 x1:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
              {t('fileName')}
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
              {t('date')}
              </th>
              
              <th className="py-4 px-4 font-medium text-black dark:text-white">
              {t('size')}
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
              {t('status')}
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
              {t('actions')}
              </th>
            </tr>
          </thead>
                 <tbody>

                 {filteredFiles.map((file, index) => (
                    <tr key={index}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <a
                            href="#"
                            onClick={() => handleButtonClick(file.key)}
                            className="cursor-pointer text-black dark:text-white hover:underline hover:text-blue-500"
                          >
                        
                        <h5 className="font-medium text-black dark:text-white">
                       File {file.name}
                        </h5>
                        </a>

                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      
                      <p className="text-black dark:text-white">
                            {new Date(file.name).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: '2-digit',
                              // hour: '2-digit',
                              // minute: '2-digit',
                              // second: '2-digit',
                            })}
                          </p>
                     

                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success">
                        Unknown
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success">
                        Unknown
                        </p>
                      </td>

                      
                      
                      
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                     <div className="flex items-center space-x-3.5">
                    {/**This button will take you to the summarization tex */}
                    <button className="hover:text-primary"
                     onClick={() => navigate(`/SummaryPage`)}
                    //onClick={() => navigate(`/SummaryPage/${file.name}`)}
                    //This did not work

                    
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
                          d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                          fill=""
                        />
                        <path
                          d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                          fill=""
                        />
                      </svg>
                    </button>
                    <button className="hover:text-primary">
                      
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
                    <button
                              className="hover:text-primary"
                              onClick={() => handleButtonClick(file.key)}
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
                          d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"
                          fill=""
                        />
                        <path
                          d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>
                </td>

                    </tr>
                  ))}
                </tbody>
        </table>
      </div>
    </div>

    {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          {[
            ...new Map(
              records
                .filter(record => record.status !== 'archived') // Filter based on status
                .map(record => [record.standardId, record]) // Map each record to its standardName and the record itself
            ),
          ].map(([standardId], index) => (
            <div key={index} className="record">
              <div className="rounded-xl border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="scard-block">
                  
                  {/* <a href={`PredefinedTemplate/${record.standardId}`} className="link-unstyled"> */}
                    {/* <h6 className="m-b-20">{standardId}</h6> */}
                    {/* <h5>{record.standardName}</h5> */}
                  {/* </a> */}
                  {/* Delete icon */}
                  {/* Archive icon */}
                {/* </div>
              </div>
            </div>
          ))}
</div> */} 
         
    </DefaultLayout>
  );
};

export default OfficerDash;