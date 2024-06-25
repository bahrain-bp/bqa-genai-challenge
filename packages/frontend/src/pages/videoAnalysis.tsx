import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DefaultLayout from '../layout/DefaultLayout';
import ConfirmationDialog from '../components/Forms/ConfirmDialog';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Loader from '../common/Loader';
import { fetchUserAttributes } from '@aws-amplify/auth';

const VideoAnalysis: React.FC = () => {
  const itemsPerPage = 5;
  const [selectedStandardName, setSelectedStandardName] = useState<string>('');
  const [selectedStandard, setSelectedStandard] = useState<string>('');
  const [standards, setStandards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filesByIndicator, setFilesByIndicator] = useState<any>({});
  const [noVideosFound, setNoVideosFound] = useState(false);
  const [criteria, setCriteria] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [bonusDecision, setBonusDecision] = useState<string>('');
  const [currentName, setCurrentName] = useState('');
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://u1oaj2omi2.execute-api.us-east-1.amazonaws.com/criteria');
        setStandards(response.data);
      } catch (error) {
        console.error('Error fetching standards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStandardChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStandardId = event.target.value;
    setSelectedStandard(selectedStandardId);
    const selectedStandardObj = standards.find((std) => std.standardId === selectedStandardId);
    if (selectedStandardObj) {
      setSelectedStandardName(selectedStandardObj.standardName);
    }
  };

  const handleBonusDecisionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBonusDecision(event.target.value);
  };

  useEffect(() => {
    const fetchCurrentUserInfo = async () => {
      try {
        const attributes = await fetchUserAttributes();
        const name: any = attributes.name;
        setCurrentName(name);
        const email: any = attributes.email;
        console.log('Current user info:', name, email);
      } catch (error) {
        console.error('Error fetching current user info:', error);
      }
    };

    fetchCurrentUserInfo();
  }, []);

  const fetchFiles = async () => {
    const url = `https://u1oaj2omi2.execute-api.us-east-1.amazonaws.com/files`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'bucket-name': 'uni-artifacts',
          'folder-name': currentName,
          'subfolder-name': `${selectedStandard}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      const files = data.files; // Ensure this matches the structure you log in Lambda

      // Filter out files containing "-split" in their name
      const filteredFiles = files.filter((file: any) => !file.Key.includes('-split'));

      // Check if there are any .mp4 files
      const mp4Files = filteredFiles.filter((file: any) => file.Key.toLowerCase().endsWith('.mp4'));

      if (mp4Files.length === 0) {
        setNoVideosFound(true);
      } else {
        setNoVideosFound(false);

        const filesByIndicator = filteredFiles.reduce((acc: any, file: any) => {
          const parts = file.Key.split('/');
          const indicatorId = parts[2]; // This assumes the indicator ID is the third part
          if (!acc[indicatorId]) {
            acc[indicatorId] = [];
          }
          acc[indicatorId].push({ name: file.Key });
          return acc;
        }, {});

        setFilesByIndicator(filesByIndicator);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error fetching uploaded files:', errorMessage);
    }
  };

  useEffect(() => {
    if (selectedStandard) {
      fetchFiles();
    }
  }, [selectedStandard, currentName]);

  const handleAnalyze = async (indicatorId: string, filePath: string) => {
    setIsLoading(true);
    try {
      const requestData = {
        bucketName: 'uni-artifacts',
        filePath,
        standardId: selectedStandard,
        indicatorId,
      };

      const response = await axios.post('https://your-api-endpoint/videoFlow', requestData);

      if (response.status === 200) {
        setCriteria(response.data.criteria); // Assuming response contains the criteria data
      } else {
        console.error('Error triggering videoFlow API:', response.statusText);
      }
    } catch (error) {
      console.error('Error in handleAnalyze:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const paginatedCriteria = criteria.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Video Analysis" />
      <div className="p-4">
        <div className="flex flex-col gap-5.5 p-6.5">
          <label className="mb-3 block text-black dark:text-white">Select Standard</label>
          <div className="relative z-20 bg-white dark:bg-form-input">
            <select
              value={selectedStandard}
              onChange={handleStandardChange}
              className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black dark:text-white"
            >
              <option value="" disabled>
                Choose a Standard
              </option>
              {standards.map((std) => (
                <option key={std.standardId} value={std.standardId}>
                  {std.standardName}
                </option>
              ))}
            </select>
            <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.8">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                    fill="#637381"
                  ></path>
                </g>
              </svg>
            </span>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-2xl text-gray-700">{selectedStandardName}</h2>
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <>
            {noVideosFound ? (
              <div className="text-center text-red-500 mb-8">No videos found</div>
            ) : (
              <>
                {Object.keys(filesByIndicator).map((indicatorId) => (
                  <div key={indicatorId}>
                    <h3 className="text-lg text-gray-700 mb-2">Indicator: {indicatorId}</h3>
                    <ul className="mb-4">
                      {filesByIndicator[indicatorId].map((file: any) => (
                        <li key={file.name}>
                          <button
                            onClick={() => handleAnalyze(indicatorId, file.name)}
                            className="text-blue-500 underline"
                          >
                            {file.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="overflow-x-auto">
                  <table className="w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    <thead>
                      <tr className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-regular rounded-lg text-sm px-5 py-3">
                        <th className="py-3 px-4 text-left font-bold border-r border-gray-300">Evaluation Result</th>
                        <th className="py-3 px-4 text-left font-bold">Criteria</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCriteria.map((criterion: any, index: any) => (
                        <tr key={criterion.id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                          <td className="py-4 px-6 border-b border-r border-gray-300 font-medium">
                            <div className="p-4 rounded">
                              <span className="text-gray-800">{criterion.result ? '✔️' : '❌'}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 border-b border-gray-300">
                            <span className="text-gray-800">{criterion.criteria}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-between mt-4">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                      Previous
                    </button>
                    <button
                      disabled={currentPage === Math.ceil(criteria.length / itemsPerPage)}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                      Next
                    </button>
                  </div>
                </div>

                <div className="mt-6.5">
                  <label className="mb-3 block text-black dark:text-white">Bonus Decision</label>
                  <textarea
                    value={bonusDecision}
                    onChange={handleBonusDecisionChange}
                    className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                  ></textarea>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default VideoAnalysis;
