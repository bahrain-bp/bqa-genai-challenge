import React, { useState } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import styled from 'styled-components';
//import './uploadEv.css'; // Importing CSS file
import { toast } from 'react-toastify';


interface StepStyleProps {
  step: 'completed' | 'incomplete';
}

interface StepContainerProps {
  width: string;
}

const MainContainer = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 16px;
`;

const StepContainer = styled.div<StepContainerProps>`
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
  position: relative;
  :before {
    content: '';
    position: absolute;
    background: #2ECC71;
    height: 4px;
    width:;
    top: 50%;
    transition: 0.4s ease;
    transform: translateY(-50%);
    left: 0;
    z-index: -1; /* Updated z-index to ensure the progress line is behind the circles */
  }
`;

const StepWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const StepStyle = styled.div<StepStyleProps>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 3px solid ${({ step }) => (step === 'completed' ? '#2ECC71' : '#F3E7F3')};
  transition: 0.4s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2; /* Added z-index to ensure the circles are above the progress line */
`;

const StepCount = styled.span`
  font-size: 19px;
  color: #f3e7f3;
  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const StepsLabelContainer = styled.div`
  position: absolute;
  top: 66px;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StepLabel = styled.span`
  font-size: 19px;
  color: #2ECC71;
  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 -25px;
  margin-top: 10px;
`;

const ButtonStyle = styled.button`
  border-radius: 4px;
  border: 0;
  background: none;
  color:#2ECC71;
  cursor: pointer;
  padding: 8px;
  width: 90px;
  :active {
    transform: scale(0.98);
  }
  :disabled {
    background: #f3e7f3;
    color: #000000;
    cursor: not-allowed;
  }
`;

const CheckMark = styled.div`
  font-size: 26px;
  font-weight: 600;
  color: #2ECC71;
  -ms-transform: scaleX(-1) rotate(-46deg); /* IE 9 */
  -webkit-transform: scaleX(-1) rotate(-46deg); /* Chrome, Safari, Opera */
  transform: scaleX(-1) rotate(-46deg);
`;


const UploadContainer = styled.div`
  p {
    margin: 0;
  }
`;

const UploadFile = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;

const UploadButton = styled.label`
  cursor: pointer;
  display: inline-block;
  padding: 8px 12px;
  border: 1px solid #2ECC71;
  border-radius: 4px;
  color: #2ECC71;
`;

const FileName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const HiddenInput = styled.input`
  display: none;
`;



interface UploadSection {
  title: string;
  description: string;
}

interface Indicator {
  label: string;
  uploadSections: UploadSection[];
}

interface Step {
  label: string;
  step: number;
  indicators: Indicator[];
}

const steps: Step[] = [
  {
    label: '',
    step: 1,
    indicators: [
      {
        label: 'Indicator 1: Vision, Mission and Values',
        uploadSections: [
          {
            title: 'Upload Section for Vision, Mission and Values',
            description: '',
          },
        ],
      },
      {
        label: 'Indicator 2: Strategic and Operational Planning',
        uploadSections: [
          {
            title: 'Upload Section for Strategic and Operational Planning',
            description: 'Description for Upload Section 2',
          },
        ],
      },
      {
        label: 'Indicator 3: Governance and Management Practices',
        uploadSections: [
          {
            title: 'Upload Section for Governance and Management Practices',
            description: '',
          },
        ],
      },
      {
        label: 'Indicator 4: Organisational Structure',
        uploadSections: [
          {
            title: 'Upload Section for Organisational Structure',
            description: '',
          },
        ],
      },
      {
        label: 'Indicator 5: Partnerships, Memoranda with other Institutions',
        uploadSections: [
          {
            title: 'Upload Section for Partnerships and Memoranda',
            description: '',
          },
        ],
      },
    ],
  },
  {
    label: '',
    step: 2,
    indicators: [
      {
        label: 'Indicator 6: Human Resources',
        uploadSections: [
          {
            title: 'Upload Section for Human Resources',
            description: '',
          },
        ],
      },
      {
        label: 'Indicator 7: Staff Development',
        uploadSections: [
          {
            title: 'Upload Section for Staff Development',
            description: '',
          },
        ],
      },
    ],
  },
  {
    label: '',
    step: 3,
    indicators: [
      {
        label: 'Indicator 8: Quality Assurance System',
        uploadSections: [
          {
            title: 'Upload Section for Quality Assurance System',
            description: '',
          },
        ],
      },
      {
        label: 'Indicator 9: Quality Enhancement',
        uploadSections: [
          {
            title: 'Upload Section for Quality Enhancement',
            description: '',
          },
        ],
      },
    ],
  },


  {
    label: '',
    step: 4,
    indicators: [
      {
        label: 'Indicator 10: Infrastructure',
        uploadSections: [
          {
            title: 'Upload Section for  Infrastructure',
            description: '',
          },
        ],
      },
      {
        label: 'Indicator 11: Information and Communications Technology',
        uploadSections: [
          {
            title: 'Upload Section for Information and Communications Technology',
            description: '',
          },
        ],
      },
      {
        label: 'Indicator 12: Learning Resources',
        uploadSections: [
          {
            title: 'Upload Section for Learning Resources',
            description: '',
          },
        ],
      },
    ],
  },
  
];


const UploadEvidence = () => {
  const [activeStep, setActiveStep] = useState(1);

  const [selectedFiles, setSelectedFiles] = useState<Array<Array<File | null>>>(
    steps.map(step => step.indicators.map(() => null))
  );
  

 // Function to handle file selection
// Function to handle file selection and upload
const handleFileChange = async (file: File, stepIndex: number, sectionIndex: number) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(' https://l1ca6m1ik7.execute-api.us-east-1.amazonaws.com', {
      method: 'POST',
      body: formData,
      headers: {
        'file-name': file.name,
        // Add any other headers if required by your backend
      },
    });

    if (response.ok) {
      // File uploaded successfully, do something if needed
      console.log('File uploaded successfully');
    } else {
      // Handle error response from the backend
      console.error('Failed to upload file');
    }
  } catch (error) {
    // Handle network errors
    console.error('Network error:', error);
  }
};



// Function to handle save button click
const handleSaveClick = async () => {
  // Iterate through selected files and trigger upload for each
  for (let stepIndex = 0; stepIndex < selectedFiles.length; stepIndex++) {
    for (let sectionIndex = 0; sectionIndex < selectedFiles[stepIndex].length; sectionIndex++) {
      const file = selectedFiles[stepIndex][sectionIndex];
      if (file) {
        await handleFileChange(file, stepIndex, sectionIndex);
        toast.success('File saved successfully!');
      }
    }
  }
};

// Function to handle cancel button click
const handleCancelClick = () => {
  // Add any necessary logic for cancel action
};



  const nextStep = () => {
    setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    setActiveStep(activeStep - 1);
  };

  const totalSteps = steps.length;
  const width = `${(100 / (totalSteps - 1)) * (activeStep - 1)}%`;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Upload Evidence" />
      <MainContainer>
        <StepContainer width={width}>
          {steps.map(({ step, label }) => (
            <StepWrapper key={step}>
              <StepStyle step={activeStep >= step ? 'completed' : 'incomplete'}>
                {activeStep > step ? (
                  <CheckMark>L</CheckMark>
                ) : (
                  <StepCount>{step}</StepCount>
                )}
              </StepStyle>
              <StepsLabelContainer>
                <StepLabel>{label}</StepLabel>
              </StepsLabelContainer>
            </StepWrapper>
          ))}
        </StepContainer>
        <ButtonsContainer>
          <ButtonStyle onClick={prevStep} disabled={activeStep === 1}>
            Previous
          </ButtonStyle>
          <ButtonStyle onClick={nextStep} disabled={activeStep === totalSteps}>
            Next
          </ButtonStyle>
        </ButtonsContainer>
      
        {activeStep && (
  <div>
    <h2>{steps[activeStep - 1].label}</h2>
    {steps[activeStep - 1].indicators.map((indicator, index) => (
      <div key={index}>
        <h3>{indicator.label}</h3>
        {indicator.uploadSections.map((uploadSection, sectionIndex) => (
          <div key={sectionIndex}>
            <h4>{uploadSection.title}</h4>
            <p>{uploadSection.description}</p>
            {/* File upload container */}
            <div className="p-4">
              <div
                id={`FileUpload-${sectionIndex}`}
                className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
              >
                {/* File input */}
                <input
                  type="file"
                  accept="*"
                  className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      handleFileChange(files[0], activeStep - 1, sectionIndex); // Call handleFileChange on file selection
                    }
                  }}
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
                 {/* Display filename here */}
        {selectedFiles[activeStep - 1][sectionIndex] && (
          <FileName>{selectedFiles[activeStep - 1][sectionIndex]?.name}</FileName>
        )}
                </div>
              </div>
            </div>
            {/* Save and cancel buttons */}
            <div className="flex justify-end gap- mb-5">
              <button
                className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white mr-4"
                type="button" // Change type to "button"
                 onClick={handleSaveClick} // Add onClick handler
              >
                Save
              </button>
              <button
                className={`flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90 mr-4`}
                type="button" // Change type to "button"
                onClick={handleCancelClick} // Add onClick handler
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    ))}
  </div>
)}

        
      </MainContainer>
    </DefaultLayout>
  );
};

export default UploadEvidence;
