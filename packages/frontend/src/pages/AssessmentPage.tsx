import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SelectGroupTwo from '../components/Forms/SelectGroup/SelectGroupTwo';
import DefaultLayout from '../layout/DefaultLayout';
import ConfirmationDialog from '../components/Forms/ConfirmDialog';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Loader from '../common/Loader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchUserAttributes } from '@aws-amplify/auth';

interface Criterion {
  id: number;
  name: string;
  maxScore: number;
  comment: string;
  outputText: string;
}

const itemsPerPage = 5;

const AssessmentPage: React.FC = () => {
  const [selectedStandard, setSelectedStandard] = useState<string>('');
  const [selectedIndicator, setSelectedIndicator] = useState<string>('');
  const [selectedStandardName, setSelectedStandardName] = useState<string>('');
  const [selectedIndicatorName, setSelectedIndicatorName] = useState<string>('');
  const [currentName, setCurrentName] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string | null>(null);
  const apiURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const attributes = await fetchUserAttributes();
        const name = attributes?.name || '';
        setCurrentName(name);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (currentName && selectedStandard && selectedIndicator) {
      
      fetchStatusAndData();
    }
  }, [currentName, selectedStandard, selectedIndicator,status]);

  const getStatus = async (): Promise<string | null> => {
    try {
      const combinedKey = `${currentName}-${selectedStandard}-${selectedIndicator}`;
      console.log('combined-key', combinedKey);
      
      const response = await axios.get(`${apiURL}/status`, {
        headers: {
          'combined-key': combinedKey,
        },
      });
      console.log(response.data[0]?.status);
      return response.data[0]?.status || null;

    } catch (error) {
      console.error('Error fetching status:', error);
      return null;
    }
  };

  const fetchStatusAndData = async () => {
    const status = await getStatus();
    setStatus(status);
    console.log(status, "status");
    if (status !== 'Processing') {
      fetchData();
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (criteria.length === 0 && (status === 'Processing' || status === 'Failed')) {
      const interval = setInterval(async () => {
        const status = await getStatus();
        setStatus(status);
        if (status === 'Completed') {
          clearInterval(interval);
          fetchData();
        } else if (status === 'Failed') {
          clearInterval(interval);
          setIsLoading(false);
          toast.error('Failed fetching content: No content found');
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [criteria.length, status]);

  const fetchData = async () => {
    try {
   //   setIsLoading(true); // Set loading state to true before fetching data

      const response = await axios.get(`${apiURL}/compareResult/${currentName}/${selectedStandard}/${selectedIndicator}`);
      if (response.data.length === 0) {
        setIsConfirmationDialogOpen(true);
      } else {
        setCriteria(response.data.map((item: any) => ({
          id: item.comparisonId,
          name: item.indicatorName,
          maxScore: 0,
          comment: item.comment,
          outputText: item.outputText,
        })));
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      setIsConfirmationDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectionChange = (
    standardId: string,
    indicatorId: string,
    standardName: string,
    indicatorName: string,
  ) => {
    setSelectedStandard(standardId);
    setSelectedIndicator(indicatorId);
    setSelectedStandardName(standardName);
    setSelectedIndicatorName(indicatorName);
     // setIsLoading(true); // Set isLoading to true when selection changes

  };

  const handleYesAIComment = () => {
    const headers = {
      'uni-name': currentName,
      'standard-number': selectedStandard,
      'indicator-number': selectedIndicator,
    };
    console.log(headers, "headers");

    axios.post(`${apiURL}/titan`, {}, { headers })
      .then((response) => {
        if (!response.data.success) {
          if (response.data.message === 'No content found') {
            //toast('No content found');
            //alert('No content found for the specified standard and indicator.');
          // } else if (response.data.message === 'Error fetching contents') {
          //   alert('An error occurred while fetching contents. Please try again.');
          // }
          // } else {
          //   alert(`An error occurred: ${response.data.message}`);
          // }
      }  } else {
          console.log('Content:', response.data.data);
          setStatus('Done');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        if (error.response) {
          if (error.response.status === 404) {
            alert('The requested resource was not found.');
          } else if (error.response.status === 500) {
            //alert('An internal server error occurred. Please try again later.');
            toast.error("No Content Found For This Indiactor");
          } else {
            alert(`Server responded with status code: ${error.response.status}`);
          }
        } else if (error.request) {
          alert('No response received from the server. Please try again later.');
        } else {
          alert('An unexpected error occurred. Please try again later.');
        }
      });
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const formatOutputText = (text: string) => {
    const formattedText = text.replace(
      /(score|compliant|compliant with the recommendation|recommendation|Compliant with recommendation|compliant(?= )|non-compliant|non compliant)/gi,
      '<strong>$1</strong>'
    );
  
    return (
      <ul>
        {formattedText.split('\n').map((point, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: point.trim() }} />
        ))}
      </ul>
    );
  };
  
  
  
  

  const paginatedCriteria = criteria.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Assessment Page" />
      <div className="p-4">
        <div className="text-center mb-8">
        <h2 className="text-2xl text-gray-700">
  {selectedStandardName && selectedIndicatorName 
    ? `${selectedStandardName} / ${selectedIndicatorName}` 
    : selectedStandardName || selectedIndicatorName}
</h2>

        </div>
        <div className="flex flex-col gap-5.5 p-6.5">
          <SelectGroupTwo onSelectionChange={handleSelectionChange} />
        </div>
        {isLoading ? (
          <Loader />
        ) : status === 'Processing' ? (
          <div className="text-center text-lg text-gray-700">
            The data is currently being processed. Please wait...
          </div>
        ) : (
          <>
            <div>
              <ConfirmationDialog
                isOpen={isConfirmationDialogOpen}
                onClose={() => setIsConfirmationDialogOpen(false)}
                onYes={handleYesAIComment}
              />
            </div>
            {selectedStandard&&selectedIndicator&&criteria.length === 0 && (
              <div className="text-center text-lg text-gray-700">
                No data found.
              </div>
)}
            {selectedStandard && selectedIndicator && criteria.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    <thead>
                      <tr className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-regular rounded-lg text-sm px-5 py-3">
                        <th className="py-3 px-4 text-left font-bold border-r border-gray-300">
                          Comment
                        </th>
                        <th className="py-3 px-4 text-left font-bold">
                          Evaluation Result
                        </th>
                        {/* <th className="py-3 px-4 text-left font-bold">
                          Compliance
                        </th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCriteria.map((criterion, index) => (
                        <tr
                          key={criterion.id}
                          className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                        >
                          <td className="py-4 px-6 border-b border-r border-gray-300 font-medium">
                            <div className="p-4 rounded">
                              {criterion.comment}
                            </div>
                          </td>
                          <td className="py-4 px-6 border-b border-gray-300">
                            <span className="text-gray-800">
                              {formatOutputText(criterion.outputText)}
                            </span>
                          </td>
                          {/* <td className="py-4 px-6 border-b border-gray-300">
                            <span className="text-gray-800">
                              Compliance
                            </span>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {criteria.length > itemsPerPage && (
                  <div className="flex justify-center mt-10 space-x-4">
                    {currentPage > 1 && (
                      <button
                        className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-regular rounded-lg text-sm px-5 py-3"
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        Previous

                      </button>

                    )}
                    {currentPage < Math.ceil(criteria.length / itemsPerPage) && (
                      <button
                        className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-regular rounded-lg text-sm px-5 py-3"
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

export default AssessmentPage;
