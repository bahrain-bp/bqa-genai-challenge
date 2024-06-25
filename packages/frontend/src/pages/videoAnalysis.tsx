import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DefaultLayout from '../layout/DefaultLayout';
import ConfirmationDialog from '../components/Forms/ConfirmDialog';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Loader from '../common/Loader';

const VideoAnalysis: React.FC = () => {
  const itemsPerPage = 5;
  const [selectedVideoPath, setSelectedVideoPath] = useState<string>('');
  const [videos, setVideos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [criteria, setCriteria] = useState<any[]>([]);
  const [bonusDecision, setBonusDecision] = useState<string>('');
  const [standardId, setStandardId] = useState<string>(''); // Assume this will be set somehow
  const [indicatorId, setIndicatorId] = useState<string>(''); // Assume this will be set somehow
  const currentPage = 1;
  const paginatedCriteria = criteria.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const isConfirmationDialogOpen = false;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://u1oaj2omi2.execute-api.us-east-1.amazonaws.com/videoList');
        setVideos(response.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVideoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVideoPath(event.target.value);
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      // Split selected video path to get bucket name and file path
      const selectedVideoParts = selectedVideoPath.split('/');
      const bucketName = 'uni-artifacts'; // Assume fixed bucket name
      const filePath = selectedVideoPath; // Assume full file path is provided

      const requestData = {
        bucketName: bucketName,
        filePath: filePath,
        standardId: 2,
        indicatorId: 4
      };

      const response = await axios.post('https://ake2mc5exi.execute-api.us-east-1.amazonaws.com/videoFlow', requestData);
      const result = response.data;
      console.log('Analysis result:', result);

      // Assume result contains criteria to be displayed in the table
      setCriteria(result.criteria || []);

    } catch (error) {
      console.error('Error during video analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBonusDecisionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBonusDecision(event.target.value);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Video Analysis" />
      <div className="p-4">
        <div className="flex flex-col gap-5.5 p-6.5">
          <label className="mb-3 block text-black dark:text-white">Select Video</label>
          <div className="relative z-20 bg-white dark:bg-form-input">
            <select
              value={selectedVideoPath}
              onChange={handleVideoChange}
              className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black dark:text-white"
            >
              <option value="" disabled>
                Choose a Video
              </option>
              {videos.map((videoPath) => (
                <option key={videoPath} value={videoPath}>
                  {videoPath}
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
          <button
            onClick={handleAnalyze}
            className="mt-4 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Analyze
          </button>
          <div className="text-center mb-8">
            <h2 className="text-2xl text-gray-700">{selectedVideoPath}</h2>
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div>
              <ConfirmationDialog isOpen={isConfirmationDialogOpen} onClose={() => {}} onYes={() => {}} />
            </div>

            <div className="overflow-x-auto mb-8">
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
                        <div className="p-4 rounded">{criterion.comment}</div>
                      </td>
                      <td className="py-4 px-6 border-b border-gray-300">
                        <span className="text-gray-800">{criterion.result ? '✔️' : '❌'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {criteria.length > itemsPerPage && (
              <div className="flex justify-center space-x-4 mb-8">
                {currentPage > 1 && (
                  <button className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-regular rounded-lg text-sm px-5 py-3">
                    Previous
                  </button>
                )}
                {currentPage < Math.ceil(criteria.length / itemsPerPage) && (
                  <button className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-regular rounded-lg text-sm px-5 py-3">
                    Next
                  </button>
                )}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                <thead>
                  <tr className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-regular rounded-lg text-sm px-5 py-3">
                    <th className="py-3 px-4 text-left font-bold border-r border-gray-300">Bonus Decision</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-4 px-6 border-b border-r border-gray-300">
                      <textarea
                        className="w-full p-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows={4}
                        value={bonusDecision}
                        onChange={handleBonusDecisionChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 border-b border-r border-gray-300">
                      <div className="p-4 rounded">{bonusDecision}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default VideoAnalysis;
