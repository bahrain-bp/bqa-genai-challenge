import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DefaultLayout from '../layout/DefaultLayout';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Loader from '../common/Loader';

const VideoAnalysis: React.FC = () => {
  const [selectedVideoPath, setSelectedVideoPath] = useState<string>('');
  const [videos, setVideos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [criteria, setCriteria] = useState<{ id: number; criteria: string; found: boolean | null }[]>([]);
  const itemsPerPage = 5;
  const currentPage = 1;

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
      const selectedVideoParts = selectedVideoPath.split('/');
      const bucketName = 'uni-artifacts';
      const filePath = selectedVideoPath;

      const requestData = {
        bucketName: bucketName,
        filePath: filePath,
        standardId: "2",
        indicatorId: "6"
      };

      const response = await axios.post('https://ake2mc5exi.execute-api.us-east-1.amazonaws.com/videoFlow', requestData);
      const result = response.data;
      console.log('Analysis result:', result);

      // Hardcoded criteria for the table
      const hardcodedCriteria = [
        { id: 1, criteria: 'Video includes clean office', found: null },
        { id: 2, criteria: 'Video includes employees', found: null }
      ];

      // Map criteria to include evaluation result
      const criteriaWithResult = hardcodedCriteria.map(criterion => {
        // Check if the criterion exists in the result
        const foundYes = result.includes(`Yes`);
        const foundNo = result.includes(`No`);
        let found: boolean | null = null;

        if (foundYes) {
          found = true;
        } else if (foundNo) {
          found = false;
        }

        return { ...criterion, found };
      });

      setCriteria(criteriaWithResult);
      setResult(result);
    } catch (error) {
      console.error('Error during video analysis:', error);
    } finally {
      setIsLoading(false);
    }
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
            <div className="overflow-x-auto mb-8">
              <table className="w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                <thead>
                  <tr className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-regular rounded-lg text-sm px-5 py-3">
                    <th className="py-3 px-4 text-left font-bold border-r border-gray-300">Evaluation Result</th>
                    <th className="py-3 px-4 text-left font-bold">Criteria</th>
                  </tr>
                </thead>
                <tbody>
                  {criteria.map((criterion) => (
                    <tr key={criterion.id} className="bg-gray-100">
                      <td className="py-4 px-6 border-b border-r border-gray-300 font-medium">
                        <div className="p-4 rounded">
                          {/* Example result format: "{Yes, The office is clean and looks new., Yes, The video shows many employees working in an office.}" */}
                          {criterion.found === true ? '✔️' : criterion.found === false ? '❌' : ''}
                        </div>
                      </td>
                      <td className="py-4 px-6 border-b border-gray-300">
                        <span className="text-gray-800">{criterion.criteria}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>{result}</div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default VideoAnalysis;
