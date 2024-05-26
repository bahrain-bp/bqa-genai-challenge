import React from 'react';
import SelectGroupTwo from './Forms/SelectGroup/SelectGroupTwo';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ isOpen, onClose }) => {
  const [selectedStandard, setSelectedStandard] = useState<string>('');
  const [selectedIndicator, setSelectedIndicator] = useState<string>('');
  const [selectedStandardName, setSelectedStandardName] = useState<string>('');
  const [selectedIndicatorName, setSelectedIndicatorName] =
    useState<string>('');
  const navigate = useNavigate();

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

    console.log('selected standard', selectedStandard);
    console.log('selected indicator', selectedIndicator);
    console.log('standrad name', selectedStandardName);
    console.log('selected indictor name', selectedIndicatorName);
  };

  if (!isOpen) return null;

  const handleButtonClick = () => {
    navigate(`/RubricPage/${selectedStandard}/${selectedIndicator}`, {
      state: {
        standardName: selectedStandardName,
        indicatorName: selectedIndicatorName,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-140 h-100 flex flex-col justify-center items-center ml-70">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center w-full">
          <h3 className="font-medium text-black dark:text-white">
            Select input
          </h3>
          <button onClick={onClose} className="text-black dark:text-white">
            X
          </button>
        </div>
        <div className="flex flex-col gap-5.5 p-6.5">
          <SelectGroupTwo onSelectionChange={handleSelectionChange} />
        </div>
        <button
          className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-regular rounded-lg text-sm px-5 py-3"
          onClick={handleButtonClick}
        >
          Generate and View
        </button>
      </div>
    </div>
  );
};

export default ModalComponent;
