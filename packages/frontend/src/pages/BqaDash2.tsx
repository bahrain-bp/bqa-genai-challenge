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
// import MultiSelect from '../components/Forms/MultiSelect';
import {
  FormControl,
  InputLabel,
  TextField,
  MenuItem,
  Select,
} from '@mui/material';

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

  const useUsername = () =>
  {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const username = queryParams.get('username');
    return username;
  }

  const username = useUsername();
  console.log('username:' + username);

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
        let filteredFiles = response.data.files;

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

  const handleStandardClick = (standardName: string) => {
    fetchDataForStandard(standardName);
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

  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName={`University Files / ${uniName}`} />

        <div className="flex justify-end py-4">
          {/* Request Document Button */}
          <button className="px-5 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-opacity-50">
            <Link to={`/BqaRequestPage?name=${name}&username=${username}`}>Request Documents</Link>
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          {/* Standard cards */}
          {/* Standard cards */}
          <div
            className="rounded-xl border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark"
            style={{ marginBottom: '20px', cursor: 'pointer' }}
            onClick={() => handleStandardClick('Standard 1')}
          >
            <h3 style={{ marginBottom: '10px', cursor: 'pointer' }}>
              Standard 1
            </h3>
            <div className="progress blue">
              <span className="progress-left">
                <span className="progress-bar"></span>
              </span>
              <span className="progress-right">
                <span className="progress-bar"></span>
              </span>
              <div className="progress-value">90%</div>
            </div>
          </div>
          <div
            className="rounded-xl border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark"
            style={{ marginBottom: '20px', cursor: 'pointer' }}
            onClick={() => handleStandardClick('Standard 2')}
          >
            <h3 style={{ marginBottom: '10px' }}>Standard 2</h3>
            <div className="progress yellow">
              <span className="progress-left">
                <span className="progress-bar"></span>
              </span>
              <span className="progress-right">
                <span className="progress-bar"></span>
              </span>
              <div className="progress-value">65%</div>
            </div>
          </div>
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
                        Download
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
                              {file.Key}
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