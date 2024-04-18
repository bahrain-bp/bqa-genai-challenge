import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
//import { ToastContainer } from 'react-toastify';
//import { ProgressBar, step } from 'react-step-ProgressBar';
//import styled from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';

interface StepContentProps {
  stepNumber: number;
  standardName:string;
  indicatorName: string;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileName: string;
  handleSaveClick: () => void;
}

const StepContent: React.FC<StepContentProps> = ({ stepNumber,  standardName, indicatorName, handleFileChange, fileName, handleSaveClick }) => (
  <>
    <h3 className="font-medium text-black dark:text-white">
      <b>{standardName}</b>
    </h3>
    <h3 className="font-medium text-black dark:text-white">
      {indicatorName}
    </h3>
    {/* File upload container */}
    <div className="p-4">
      <div
        id="FileUpload"
        className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
      >
        <input
          type="file"
          accept="*"
          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center justify-center space-y-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* SVG paths */}
            </svg>
          </span>
          <p>
            <span className="text-primary">Click to upload</span> or drag and drop
          </p>
          <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
          <p>(max, 800 X 800px)</p>
          {fileName && <p>{fileName}</p>}
        </div>
      </div>
    </div>
    {/* Save and cancel buttons */}
    
    <div className="flex justify-end gap- mb-5">
      <button
        className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white mr-4"
        type="submit"
      >
        Cancel
      </button>
      <button
        className={`flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90 mr-4`}
        type="button" // Change type to "button"
        onClick={handleSaveClick} // Add onClick handler
      >
        {stepNumber === 1 ? 'Save' : 'Next'}
      </button>
    </div>
  </>
);

const UploadEvidence = () => {
  //const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [savedSteps, setSavedSteps] = useState<number[]>([]);
  //const [saveClicked, setSaveClicked] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const handleSaveClick = () => {
    //setSaveClicked(true);
    setSavedSteps([...savedSteps, currentStep]);
    toast.success('File saved successfully!');
    moveToNextStep();
    
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setFileName(file.name);
    }
  };

  const moveToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Upload Evidence" />
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex flex-col items-center justify-between mt-2">
          <div className="flex items-center">
            {/* Progress circles */}
            {[1, 2, 3].map(step => (
              <React.Fragment key={step}>
                <div
                  className={`flex items-center justify-center sm:m5 sm:max-w-xs sm:h-5 md:w-6 md:h-6 md:h-6 xl:w-8 xl:h-8 rounded-full ${
                    savedSteps.includes(step) ? 'bg-green-500' : 'bg-stone-200'
                  }`}
                ></div>
                {step !== 3 && (
                  <div
                    className={`sm:w-[30px] lg:w-[80px] h-2 ${
                      savedSteps.includes(step) ? 'bg-green-500' : 'bg-stone-200'
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="text-sm text-gray-500 mt-3"></div>
        </div>
      </div>

      {/* Render content based on current step */}
      {currentStep === 1 && (
        <StepContent
          stepNumber={1}
          standardName='Standard 1: Governance and Management – 5 Indicators'
          indicatorName='Indicator 1: Vision, Mission and Values'
          handleFileChange={handleFileChange}
          fileName={fileName}
          handleSaveClick={handleSaveClick}
        />
      )}
      {currentStep === 2 && savedSteps.includes(1) && (
        <StepContent
          stepNumber={2}
          standardName='Standard 2: Human Resources Management – 2 Indicators'
          indicatorName='Indicator 6 - Human Resources'
          handleFileChange={handleFileChange}
          fileName={fileName}
          handleSaveClick={handleSaveClick}
        />
      )}
      {currentStep === 3 && savedSteps.includes(2) && (
        <StepContent
          stepNumber={3}
          standardName='Standard 3: Quality Assurance and Enhancement – 2 Indicators '
          indicatorName='Indicator 8 - Quality Assurance System'
          handleFileChange={handleFileChange}
          fileName={fileName}
          handleSaveClick={handleSaveClick}
        />
      )}
      {/* Add more steps as needed */}
    </DefaultLayout>
  );
};

export default UploadEvidence;
