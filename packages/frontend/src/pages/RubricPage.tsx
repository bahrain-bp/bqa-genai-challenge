import React, { useState, ChangeEvent } from 'react';
import DefaultLayout from '../layout/DefaultLayout';

interface Criterion {
  id: number;
  name: string;
  maxScore: number;
}

const criteria: Criterion[] = [
  { id: 1, name: 'Criterion 1 bhb hbyubuh vyuub byububiu bubububu buhbubububuyb njibnijbi bnuibiu hibuibiubiubibibiu hniubiu', maxScore: 5 },
  { id: 2, name: 'Criterion 2', maxScore: 10 },
  { id: 3, name: 'Criterion 3', maxScore: 15 },
  { id: 4, name: 'Criterion 4', maxScore: 7 },
  { id: 5, name: 'Criterion 5', maxScore: 12 },
  { id: 6, name: 'Criterion 6', maxScore: 8 },
  { id: 7, name: 'Criterion 7', maxScore: 20 },
  { id: 8, name: 'Criterion 8', maxScore: 10 },
  { id: 9, name: 'Criterion 9', maxScore: 15 },
  { id: 10, name: 'Criterion 10', maxScore: 13 },
];

const itemsPerPage = 5; // Number of items per page

const RubricPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const paginatedCriteria = criteria.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <DefaultLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Assessment Rubric
        </h1>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-center" colSpan={3}>
                Standard Name
              </th>
            </tr>
            <tr>
              <th className="py-2 px-4 border-b text-center" colSpan={3}>
                Indicator Name
              </th>
            </tr>
            <tr>
              <th className="py-2 px-4 border-b text-center">Criterion</th>
              <th className="py-2 px-4 border-b text-center">Generated Text</th>
              <th className="py-2 px-4 border-b text-center">Score</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCriteria.map((criterion, index) => (
              <tr key={criterion.id}>
                <td className="py-2 px-4 border-b border-r text-center">
                  {criterion.name}
                </td>
                <td className="py-2 px-4 border-b border-r text-center">
                  Blah blah yuygu yubybybyuuybybybyby ybbybybybbuybu ubbubbbuy bubbbububbbubu ubbbu
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {criterion.maxScore}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center mt-4">
          <button
            className="mr-2 px-4 py-2 bg-gray-200 rounded"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 bg-gray-200 rounded"
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
