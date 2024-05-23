import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DefaultLayout from '../layout/DefaultLayout';
import { getCurrentUser } from '@aws-amplify/auth';

interface Criterion {
  id: number;
  name: string;
  maxScore: number;
  comment: string; // Adding the comment property to Criterion
  outputText: string; // Adding the outputText property to Criterion
}

const itemsPerPage = 2; // Number of items per page

const RubricPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const apiURL = import.meta.env.VITE_API_URL;
  const uniName = getCurrentUser();
  console.log(uniName, 'name');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiURL}/compareResult/BUB/4/10`);
        setCriteria(
          response.data.map((item: any) => ({
            // Mapping over response data to format it properly
            id: item.comparisonId, // Assuming comparisonId can be used as id
            name: item.indicatorName,
            maxScore: 0, // Setting maxScore to 0 for now as it's not provided in the response
            comment: item.comment,
            outputText: item.outputText,
          })),
        );
        console.log('comp results', response.data);
      } catch (error) {
        console.error('Error fetching criteria:', error);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const formatOutputText = (text: string) => {
    // Split the text at periods followed by a space to create new lines
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
      <div className="p-4">
        <h1 className="text-4xl font-semibold mb-8 text-center text-blue-600">
          Assessment Rubric
        </h1>
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-3 px-4 text-left font-bold">Comment</th>
                <th className="py-3 px-4 text-left">Generated Text</th>
                <th className="py-3 px-4 text-center">Score</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCriteria.map((criterion, index) => (
                <tr
                  key={criterion.id}
                  className={index % 2 === 0 ? 'bg-gray-100' : ''}
                >
                  <td className="py-4 px-6 border-b border-gray-200 font-bold">
                    {criterion.comment}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    <span className="text-gray-800 font-medium">
                      {formatOutputText(criterion.outputText)}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200 text-center">
                    {criterion.maxScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-8">
          <button
            className="mr-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(criteria.length / itemsPerPage)}
          >
            Next
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default RubricPage;
