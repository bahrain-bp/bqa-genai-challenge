import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DefaultLayout from '../layout/DefaultLayout';
import { useParams, useLocation } from 'react-router-dom';
import ConfirmationDialog from '../components/Forms/ConfirmDialog';
import Loader from '../common/Loader';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { toast } from 'react-toastify';
import {fetchUserAttributes } from 'aws-amplify/auth';

interface Criterion {
  id: number;
  name: string;
  maxScore: number;
  comment: string;
  outputText: string;
}

const itemsPerPage = 2;

const RubricPage: React.FC = () => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { standardId, indicatorId } = useParams<{
    standardId: string;
    indicatorId: string;
  }>();
  const location = useLocation();
  const standardName = location.state?.standardName || '';
  const indicatorName = location.state?.indicatorName || '';

  useEffect(() => {
    const fetchCurrentUserInfo = async () => {
      try {
        const attributes = await fetchUserAttributes();
        const email:any = attributes.email;
        const name:any= attributes.name;
        setCurrentEmail(email);
        setCurrentName(name);
      } catch (error) {
        console.error('Error fetching current user info:', error);
      }
    };

    fetchCurrentUserInfo();
  }, [currentName]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(currentName,"current name")
        const response = await axios.get(
          `https://u1oaj2omi2.execute-api.us-east-1.amazonaws.com/compareResult/${currentName}/${standardId}/${indicatorId}`,
        );
        if (response.data.length === 0) {
          setIsConfirmationDialogOpen(true);
        } else {
          setCriteria(
            response.data.map((item: any) => ({
              id: item.comparisonId,
              name: item.indicatorName,
              maxScore: 0,
              comment: item.comment,
              outputText: item.outputText,
            })),
          );
        }
      } catch (error) {
        console.error('Error fetching results:', error);
        setIsConfirmationDialogOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [standardId, indicatorId,currentName]);

  const handleYesAIComment = () => {
    const headers = {
      'uni-name': `${currentName}`,
      'standard-number': standardId,
      'indicator-number': indicatorId,
    };

    axios
      .post(
        'https://u1oaj2omi2.execute-api.us-east-1.amazonaws.com/titan',
        {},
        { headers },
      )
      .then((response) => {
        console.log('Response:', response.data);

        if (!response.data.success) {
          if (response.data.message === 'No content found') {
            toast('No content found');
            alert('No content found for the specified standard and indicator.');
          } else if (response.data.message === 'Error fetching contents') {
            alert(
              'An error occurred while fetching contents. Please try again.',
            );
          } else {
            alert(`An error occurred: ${response.data.message}`);
          }
        } else {
          // Handle and display the content if there are no errors
          console.log('Content:', response.data.data);
          // Assuming you reload to update the content, adjust as needed
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        if (error.response) {
          // The request was made and the server responded with a status code
          if (error.response.status === 404) {
            alert('The requested resource was not found.');
          } else if (error.response.status === 500) {
            alert('An internal server error occurred. Please try again later.');
          } else {
            alert(
              `Server responded with status code: ${error.response.status}`,
            );
          }
        } else if (error.request) {
          // The request was made but no response was received
          alert(
            'No response received from the server. Please try again later.',
          );
        } else {
          // Something happened in setting up the request that triggered an error
          alert('An unexpected error occurred. Please try again later.');
        }
      });
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const formatOutputText = (text: string) => {
    return text.split('. ').map((sentence, index) => (
      <span key={index}>
        {sentence}
        <br />
        <br />
      </span>
    ));
  };

  const paginatedCriteria = criteria.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Assessment Rubric" />

      <div className="p-4">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl text-gray-700">
                {standardName} / {indicatorName}
              </h2>
            </div>

            <div>
              <ConfirmationDialog
                isOpen={isConfirmationDialogOpen}
                onClose={() => setIsConfirmationDialogOpen(false)}
                onYes={handleYesAIComment}
              />
            </div>
            {criteria.length === 0 ? (
              <div className="text-center text-lg text-gray-700">
                No data found.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    <thead>
                      <tr className="bg-blue-700 text-white">
                        <th className="py-3 px-4 text-left font-bold border-r border-gray-300">
                          Comment
                        </th>
                        <th className="py-3 px-4 text-left font-bold">
                          Generated Text
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCriteria.map((criterion, index) => (
                        <tr
                          key={criterion.id}
                          className={`${
                            index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                          }`}
                        >
                          <td className="py-4 px-6 border-b border-r border-gray-300 font-medium">
                            <div className=" p-4 rounded">
                              {criterion.comment}
                            </div>
                          </td>
                          <td className="py-4 px-6 border-b border-gray-300">
                            <span className="text-gray-800">
                              {formatOutputText(criterion.outputText)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {criteria.length > itemsPerPage && (
                  <div className="flex justify-center mt-8">
                    {currentPage > 1 && (
                      <button
                        className="mr-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none"
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        Previous
                      </button>
                    )}
                    {currentPage <
                      Math.ceil(criteria.length / itemsPerPage) && (
                      <button
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none"
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        Next
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default RubricPage;
