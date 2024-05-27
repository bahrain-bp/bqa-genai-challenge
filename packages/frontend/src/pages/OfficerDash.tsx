import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
// import ChartThree from '../components/Charts/ChartThree';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Loader from '../common/Loader';
import { useEffect, useState } from 'react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { toast } from 'react-toastify';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import ModalComponent from '../components/Modal';

import {
  FormControl,
  InputLabel,
  TextField,
  MenuItem,
  Select,
} from '@mui/material';
// import { createGlobalStyle } from 'styled-components';

type FileDetail = {
  key: string;
  name: string;
  date: string;
};

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

const OfficerDash = () => {
  const { t } = useTranslation(); // Hook to access translation functions

  const [currentName, setCurrentName] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [files, setFiles] = useState<FileDetail[]>([]);
  const [, /*isDownloading*/ setIsDownloading] = useState(false);
  const apiURL = import.meta.env.VITE_API_URL;

  const [records, setRecords] = useState<Record[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [, /*fileCount*/ setFileCount] = useState(0);
  const [, /*fileCountsByStandard*/ setFileCountsByStandard] = useState({});
  const [, /*fileCountz*/ setFileCountz] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [state, setState] = useState<ChartTwoState>({
    series: [{ name: 'Standard', data: [] }],
  });
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const options: ApexOptions = {
    colors: ['#3C50E0', '#80CAEE'],

    chart: {
      events: {
        click: function (_: any, __: any, { dataPointIndex }) {
          const selectedStandardId = records[dataPointIndex].standardId;
          fetchUploadedFiles(selectedStandardId); // Function to fetch files based on standardId
        },
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
      categories: records.map((record) => record.standardId.replace(/\D/g, '')),
      title: {
        text: 'Standard Number',
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'Satoshi, sans-serif',
          color: '#263238',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Number of Files',
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'Satoshi, sans-serif',
          color: '#263238',
        },
      },
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

    // tooltip: {
    //   y: {
    //     formatter: function (val: number) {
    //       return `Files: ${val}`;
    //     },
    //   },
    // },
  };

  const fetchCurrentUserInfo = async () => {
    try {
      const attributes = await fetchUserAttributes();
      const name: any = attributes.name;

      setCurrentName(name);
    } catch (error) {
      console.error('Error fetching current user info:', error);
    }
  };
  useEffect(() => {
    fetchCurrentUserInfo();
  }, []);

  const fetchFileCounts = async () => {
    const url = `${apiURL}/count`; // Adjust this to your actual API endpoint
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'bucket-name': 'uni-artifacts', // Any required headers
          'folder-name': currentName, // Optional, adjust as needed
        },
      });
      if (!response.ok) throw new Error(`HTTP status ${response.status}`);

      const counts = await response.json();

      // Assume `counts` is an object like { 'Standard1': 4, 'Standard2': 5, ... }
      const chartData = records.map((record) => counts[record.standardId] || 0);
      setState((prevState) => ({
        ...prevState,
        series: [
          {
            name: 'Files',
            data: chartData,
          },
        ],
      }));
      setFileCountz(counts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching file counts:', error);
    }
  };

  useEffect(() => {
    if (currentName) {
      fetchFileCounts();
    }
  }, [currentName]);

  //fetch uploaded folders TRY#1
  const fetchRecords = async () => {
    try {
      // const api = import.meta.env.VITE_API_URL;
      // https://tds1ye78fl.execute-api.us-east-1.amazonaws.com
      // const response = await fetch(`${apiURL}/standards`);
      const response = await fetch(
        `https://tds1ye78fl.execute-api.us-east-1.amazonaws.com/standards`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      const data = await response.json();
      // Sort the records by extracting the number from standardId
      const sortedData = data.sort((a: Record, b: Record) => {
        const numA = parseInt(a.standardId.replace(/\D/g, ''), 10);
        const numB = parseInt(b.standardId.replace(/\D/g, ''), 10);
        return numA - numB;
      });
      const recordMap = new Map();
      sortedData.forEach((item: Record) => {
        if (item.status !== 'archived' && !recordMap.has(item.standardId)) {
          recordMap.set(item.standardId, item);
        }
      });
      const uniqueRecords = Array.from(recordMap.values());
      setRecords(uniqueRecords);
      setLoading(false); // Update state with sorted records
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };
  useEffect(() => {
    fetchRecords(); // Fetch records for the extracted standard name // Fetch records when the component mounts
  }, []);
  const fetchUploadedFiles = async (standardId: string) => {
    const url = `${apiURL}/files`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'bucket-name': 'uni-artifacts',
          'folder-name': currentName,
          'subfolder-name': standardId,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();

      if (data.files && Array.isArray(data.files)) {
        // Filter out files containing "-split" in their name
        const filteredFiles = data.files.filter(
          (file: any) => !file.Key.includes('-split'),
        );

        const fetchedFiles: FileDetail[] = filteredFiles.map((file: any) => ({
          key: file.Key,
          name: file.Key.split('/').pop(),
          date: file.Date,
        }));

        setFiles(fetchedFiles);
        setFileCountsByStandard((prevCounts) => ({
          ...prevCounts,
          [standardId]: fetchedFiles.length,
        }));

        setFileCount(fetchedFiles.length);

        const indicators: any = [
          ...new Set(filteredFiles.map((file: any) => file.Key.split('/')[2])),
        ];
        setIndicators(indicators);
      } else {
        console.error('Expected files to be an array but got:', data.files);
        setFiles([]);
      }

      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching uploaded files:', error);
      // Handle error
    }
  };

  useEffect(() => {
    if (currentName) {
      fetchUploadedFiles('Standard1');
    }
  }, [currentName]);

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

  // delet file
  const handleFileDelete = async (fileKey: string) => {
    try {
      const url = `${apiURL}/deleteFile`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bucketName: 'uni-artifacts', // Your S3 bucket name
          key: fileKey, // This should be the full path of the file in S3
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      toast.success('File deleted successfully');

      // Update local state to remove the file from the list
      setFiles((prevFiles) => prevFiles.filter((file) => file.key !== fileKey));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Delete-file error:', errorMessage);
      toast.error(`Failed to delete file: ${errorMessage}`);
    }
  };

  //Chart
  // Filtering files based on the selected indicator
  const filteredFiles = files.filter((file) => {
    return (
      (selectedIndicator === '' || file.key.includes(selectedIndicator)) &&
      (searchTerm === '' ||
        file.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
    }));
  };
  handleReset;
  const [indicators, setIndicators] = useState<string[]>([]);

  return (
    <DefaultLayout>
      {loading && <Loader />}

      <Breadcrumb pageName={t('universityOfficerDashboard')} />
      <div className="flex justify-end py-4 items-center">
          {/* View Generated AI Comments Button */}
          <div className="ml-4">
            <button
              type="button"
              className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-regular rounded-lg text-sm px-5 py-3"
              onClick={() => setIsModalOpen(true)}
            >
              View Generated AI Comments
            </button>
          </div>
          </div>

          <ModalComponent
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

      <div className="grid grid-cols gap-4 md:gap-6 2xl:gap-7.5 sm:px-7.5 xl:pb-1">
        {/* <ChartTwo /> */}

        <div className="col-span-full rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
          <div className="mb-4 justify-between gap-4 sm:flex">
            <div>
              <h4 className="text-xl font-semibold text-black dark:text-white">
                Standards Progress
              </h4>
            </div>
            <div></div>
          </div>

          <div>
            {loading ? (
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
        {/* <ChartThree /> */}
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
          <FormControl variant="outlined" size="small" style={{ width: '29%' }}>
            <InputLabel>Indicator</InputLabel>
            <Select
              value={selectedIndicator}
              onChange={(e) => setSelectedIndicator(e.target.value)}
              label="Indicator"
            >
              <MenuItem value="">All</MenuItem>
              {indicators.map((indicator: any, index: any) => (
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
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file, index) => (
                <tr key={index}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    {/* <a
                            href="#"
                            onClick={() => handleButtonClick(file.key)}
                            className="cursor-pointer text-black dark:text-white hover:underline hover:text-blue-500"
                          > */}

                    <h5 className="font-medium text-black dark:text-white">
                      {file.key}
                    </h5>
                    {/* </a> */}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {new Date(file.date).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </p>
                  </td>

                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      {/**This button will take you to the summarization tex */}
                      <button
                        className="hover:text-primary"
                        onClick={() =>
                          navigate('/SummaryPage', {
                            state: {
                              fileName: file.key,
                            },
                          })
                        }
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
                      {/* Delete button */}
                      <button
                        className="hover:text-primary"
                        onClick={() => handleFileDelete(file.key)}
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
    </DefaultLayout>
  );
};

export default OfficerDash;
