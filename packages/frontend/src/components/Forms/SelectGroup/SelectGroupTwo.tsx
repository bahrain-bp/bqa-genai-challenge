import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SelectGroupTwoProps {
  onSelectionChange: (
    standardId: string,
    standardName: string,
    indicatorId: string,
    indicatorName: string,
  ) => void;
}

const SelectGroupTwo: React.FC<SelectGroupTwoProps> = ({
  onSelectionChange,
}) => {
  const [standards, setStandards] = useState<any[]>([]);
  const [selectedStandard, setSelectedStandard] = useState<string>('');
  const [indicators, setIndicators] = useState<any[]>([]);
  const [selectedIndicator, setSelectedIndicator] = useState<string>('');
  const [selectedStandardName, setSelectedStandardName] = useState<string>('');
  const [selectedIndicatorName, setSelectedIndicatorName] =
    useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://u1oaj2omi2.execute-api.us-east-1.amazonaws.com/criteria',
        );
        setStandards(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const handleStandardChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedStandardId = event.target.value;
    setSelectedStandard(selectedStandardId);
    const selectedStandardObj = standards.find(
      (std) => std.standardId === selectedStandardId,
    );
    if (selectedStandardObj) {
      setSelectedStandardName(selectedStandardObj.standardName); // Set selected standard name
      setIndicators(selectedStandardObj.indicators);
      setSelectedIndicator(''); // Reset selected indicator when changing standard
    }
  };

  useEffect(() => {
    if (selectedStandard && selectedIndicator) {
      onSelectionChange(
        selectedStandard,
        selectedIndicator,
        selectedStandardName,
        selectedIndicatorName, // Pass selected indicator name// Pass selected standard name
      );
    }
  }, [
    selectedStandard,
    selectedIndicator,
    selectedStandardName,
    selectedIndicatorName,
    onSelectionChange,
  ]);

  const handleIndicatorChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedIndicatorId = event.target.value;
    setSelectedIndicator(selectedIndicatorId);
    const selectedIndicatorObj = indicators.find(
      (ind) => ind.indicatorId === selectedIndicatorId,
    );
    if (selectedIndicatorObj) {
      setSelectedIndicatorName(selectedIndicatorObj.indicatorName); // Set selected indicator name
    }
  };

  return (
    <div>
      <label className="mb-3 block text-black dark:text-white">
        Select Standard
      </label>
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

      {selectedStandard && (
        <div>
          <label className="mb-3 block text-black dark:text-white">
            Select Indicator
          </label>
          <div className="relative z-20 bg-white dark:bg-form-input">
            <select
              value={selectedIndicator}
              onChange={handleIndicatorChange}
              className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black dark:text-white"
            >
              <option value="" disabled>
                Choose an Indicator
              </option>
              {indicators.map((indicator) => (
                <option
                  key={indicator.indicatorId}
                  value={indicator.indicatorId}
                >
                  {indicator.indicatorName}
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
                    d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 
                    8.29289Z"
                    fill="#637381"
                  ></path>
                </g>
              </svg>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectGroupTwo;
