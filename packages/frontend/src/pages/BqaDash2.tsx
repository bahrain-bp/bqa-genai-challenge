import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './BqaDash1.css'; // Custom CSS file for progress bars
import { ToastContainer } from 'react-toastify';
import Loader from '../common/Loader';
import Pagination from '@mui/material/Pagination';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// import MultiSelect from '../components/Forms/MultiSelect';
import {
  FormControl,
  InputLabel,
  TextField,
  MenuItem,
  Select,
} from '@mui/material';
// Type definitions
interface Record {
  standardId: string;
  standardName: string;
  status: string;
}
const BqaDash2 = ({}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [standard, setStandard] = useState<string>('Standard 1');
  const [isLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const location = useLocation();
  const uniName = location.state.uniName;
  const apiURL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  console.log(uniName, 'name uni');
  // State for search term in the search bar
  const [searchTerm, setSearchTerm] = useState('');

  // State for selected indicator in the select menu
  const [selectedIndicator, setSelectedIndicator] = useState('');

  // import { useLocation } from 'react-router-dom';

  // function useQuery() {
  //   return new URLSearchParams(useLocation().search);
  // }

  //const [selectedFile, setSelectedFile] = useState(null);
  const { name } = useParams();
  console.log('name:' + name);
  // const query = useQuery();
  // const name = query.get('name');

  //use /files enpoint to fetch uni files --pass uniName/Standard selected
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/files`,
          {
            headers: {
              'Content-Type': 'application/json',
              'bucket-name': 'uni-artifacts',
              'folder-name': uniName,
              'subfolder-name': standard.replace(/\s/g, ''),
            },
          },
        );
        let filteredFiles = response.data.files.map((file: any) => ({
          ...file,
          name: file.Key.split('/').pop() // Add filename property to each file object
        }));
         // Filter out files containing "-split" in their name
      filteredFiles = filteredFiles.filter(
        (file: any) => !file.Key.includes('-split'),
      );
        // Filter based on search term
        if (searchTerm.trim() !== '') {
          filteredFiles = filteredFiles.filter((file: any) =>
            file.Key.toLowerCase().includes(searchTerm.toLowerCase()),
          );
        }


        // Filter based on selected indicator
        if (selectedIndicator !== '') {
          filteredFiles = filteredFiles.filter((file: any) =>
            file.Key.includes(selectedIndicator),
          );
        }

        setFiles(filteredFiles);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error
      }
    };
    fetchData();
  }, [standard, searchTerm, selectedIndicator, uniName]);
  // Calculate the indexes for the current page based on the filtered files
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFiles = files.slice(indexOfFirstItem, indexOfLastItem);

  console.log('files', files);
  // In the Select component, populate the options with unique indicators from files
  const indicators = [...new Set(files.map((file) => file.Key.split('/')[2]))];

  const fetchDataForStandard = (standardName: string) => {
    setStandard(standardName);
  };

  const handleStandardClick = (standardId: string) => {
    setStandard(standardId);
    setCurrentPage(1);  // Reset to the first page when changing standards
    fetchDataForStandard(standardId);
  };

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

  //////////////////////////
  useEffect(() => {
    console.log('University name received:', name);

    // console.log("University email received:", email);
    // Fetch more data if needed using the university email
  }, []);
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
  
  //Chart
  // Filtering files based on the selected indicator
  // const filteredFiles = files.filter((file) => {
  //   return (
  //     (selectedIndicator === '' || file.key.includes(selectedIndicator)) &&
  //     (searchTerm === '' ||
  //       file.name.toLowerCase().includes(searchTerm.toLowerCase()))
  //   );
  // });

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName={`University Files / ${uniName}`} />

        <div className="flex justify-end py-4">
          {/* Request Document Button */}
          <button className="px-5 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-opacity-50">
            <Link to={`/BqaRequestPage?name=${name}`}>Request Documents</Link>
          </button>
        </div>
        {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          {/* Standard cards */}
          {/* Standard cards */}
          
          {/* <div
            className="rounded-xl border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark"
            style={{ marginBottom: '20px', cursor: 'pointer' }}
            onClick={() => handleStandardClick('Standard 1')}
          > */}
            {/* <h3 style={{ marginBottom: '10px', cursor: 'pointer' }}>  */}
            {/* </h3> */} 
            {/* <div className="progress blue">
              <span className="progress-left">
                <span className="progress-bar"></span>
              </span>
              <span className="progress-right">
                <span className="progress-bar"></span>
              </span>
              <div className="progress-value">90%</div>
            </div> */}
          {/* </div> */}
          {/* <div
            className="rounded-xl border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark"
            style={{ marginBottom: '20px', cursor: 'pointer' }}
            onClick={() => handleStandardClick('')}
          >
            <h3 style={{ marginBottom: '10px' }}></h3>
            {/* <div className="progress yellow">
              <span className="progress-left">
                <span className="progress-bar"></span>
              </span>
              <span className="progress-right">
                <span className="progress-bar"></span>
              </span>
              <div className="progress-value">65%</div>
            </div> */}
          {/* </div> */} 
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:gap-7.5">
  {records.map((record) => (
    <div
      key={record.standardId}
      className={`rounded-xl border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark ${standard === record.standardId ? 'bg-green-200' : ''}`}
      style={{ marginBottom: '20px', cursor: 'pointer' }}
      onClick={() => handleStandardClick(record.standardId)}
    >
      <h3 style={{ marginBottom: '10px' }}>
        {record.standardName}
      </h3>
    </div>
  ))}
</div>

    
        {/* Add more standard cards as needed */}

        {/* Table */}
        {isLoading ? (
          <Loader /> // Render loader component when loading is true
        ) : (
          <>
            {/* <div className="flex flex-col gap-2 p-2 bg-white">
              <MultiSelect id="multiSelect" />
            </div> */}

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
                    {indicators.map((indicator, index) => (
                      <MenuItem key={index} value={indicator}>
                        {indicator}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                        File Name
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Date
                      </th>
                      <th className="py-6 px-3 font-medium text-black dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentFiles.map((file, key) => (
                      <tr key={key}>
                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                          <a
                            href="#"
                            onClick={() => handleButtonClick(file.Key)}
                            className="cursor-pointer text-black dark:text-white hover:underline hover:text-blue-500"
                          >
                            <h5 className="font-medium hover:text-blue-500 hover:underline">
                              {file.name}
                            </h5>
                          </a>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {new Date(file.Date).toLocaleString('en-US', {
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
                            <button
                              className="hover:text-primary"
                              onClick={() => handleButtonClick(file.Key)}
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
                             {/**This button will take you to the summarization tex */}
                      <button
                        className="hover:text-primary"
                        onClick={() =>
                          navigate('/SummaryPage', {
                            state: {
                              fileName: file.name,
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
                          </div>


                        </td>
                        
                      </tr>
                    ))}
                  </tbody>
                  <div className="flex justify-end mt-4">
                    <Pagination
                      count={Math.ceil(files.length / itemsPerPage)}
                      page={currentPage}
                      onChange={(value: any) => setCurrentPage(value)}
                      // color="primary"
                    />
                  </div>
                </table>
              </div>
            </div>
          </>
        )}
        {isDownloading && (
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        )}
      </DefaultLayout>
    </>
  );
};

export default BqaDash2;