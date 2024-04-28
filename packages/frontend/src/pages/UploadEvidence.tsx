import React, { useState, useEffect } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FileUpload } from 'primereact/fileupload';

interface ProgressLineProps {
  activeStep: number;
  totalSteps: number;
}

interface StepStyleProps {
  completed: boolean;
}

const MainContainer = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 16px;
`;

const StepContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
  position: relative;
`;

const StepWrapper = styled.div`
  flex: ;
  position: relative;
  display: flex;
  justify-content: ; // Center the circle within each segment
`;

const ProgressLine = styled.div`
  height: 9px;
  background: #2ECC71;
  width: ${props => `calc(${props.activeStep / (props.totalSteps - 1) * 100}% - 10px)`};
  position: absolute;
  top: 16px; // Adjust this value to align with the center of your StepStyle circles
  left: -4 px; // Half the size of the StepStyle to start the line right after the first circle
  z-index: -8;
`;


const StepStyle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ completed }) => completed ? '#2ECC71' : '#FFFFFF'};
  border: 3px solid ${({ completed }) => completed ? '#2ECC71' : '#F3E7F3'};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; // Ensures correct positioning within StepWrapper
  z-index: 1; // Makes sure it appears above the progress line
`;

const StepCount = styled.span`
  font-size: 19px;
  color: #2ECC71;
`;

const StepsLabelContainer = styled.div`
  position: absolute;
  top: 66px;
  left: 50%;
  transform: translateX(-50%);
`;

const StepLabel = styled.span`
  font-size: 19px;
  color: #2ECC71;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ButtonStyle = styled.button`
  padding: 8px;
  width: 90px;
  border-radius: 4px;
  border: 0;
  background: none;
  color: #2ECC71;
  cursor: pointer;
  :disabled {
    color: #B1B1B1;
    cursor: not-allowed;
  }
`;

const UploadEvidence = () => {
  const [standards, setStandards] = useState([]);
  //const [uploadFiles, setUploadFiles] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [uploadDrafts, setUploadDrafts] = useState({});
  

  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const response = await fetch(`https://tds1ye78fl.execute-api.us-east-1.amazonaws.com/standards`);
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        const rawData = await response.json();
        const standardsMap = new Map();
        rawData.forEach(item => {
          if (!standardsMap.has(item.standardId)) {
            standardsMap.set(item.standardId, { ...item, indicators: [] });
          }
          standardsMap.get(item.standardId).indicators.push({
            label: item.indicatorName,
            uploadSection: item.uploadSection
          });
        });
        setStandards(Array.from(standardsMap.values()));
      } catch (error) {
        console.error('Error fetching standards:', error);
        toast.error(`Error fetching standards: ${error.message}`);
      }
    };
  
    fetchStandards();
  }, []);
  

  useEffect(() => {
    console.log("Component mounted, loading drafts from local storage");
    const loadedDrafts = loadFromLocalStorage('uploadDrafts');
    if (loadedDrafts) {
      console.log("Drafts loaded successfully:", loadedDrafts);
      setUploadDrafts(loadedDrafts);
    } else {
      console.log("No drafts found in local storage.");
    }
  }, []);

  const handleFileSelect = (e, indicatorIndex) => {
    const selectedFiles = e.files ? e.files.map(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file); // Converts the file to a data URL
        return new Promise(resolve => {
            reader.onload = () => resolve({
                name: file.name,
                size: file.size,
                type: file.type,
                dataUrl: reader.result // This is the data URL
            });
        });
    }) : [];

    Promise.all(selectedFiles).then(filesWithPreview => {
        setUploadFiles(prevUploads => {
            const updatedUploads = { ...prevUploads };
            if (!updatedUploads[activeStep]) updatedUploads[activeStep] = {};
            updatedUploads[activeStep][indicatorIndex] = filesWithPreview;
            return updatedUploads;
        });

        saveDrafts(activeStep, indicatorIndex, filesWithPreview);
    });
};


  const saveDrafts = (step, index, files) => {
    const newDrafts = { ...uploadDrafts };
    if (!newDrafts[step]) newDrafts[step] = {};
    newDrafts[step][index] = files;
    console.log('Saving drafts:', newDrafts);
    setUploadDrafts(newDrafts);
    saveToLocalStorage('uploadDrafts', newDrafts);
  };

  const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const loadFromLocalStorage = key => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };

  const nextStep = () => {
    setActiveStep(prevStep => prevStep + 1);
  };

  const prevStep = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const deleteFile = (step, index, fileIndex) => {
    setUploadFiles(currentFiles => {
      const updatedFiles = { ...currentFiles };
      if (updatedFiles[step] && updatedFiles[step][index]) {
        // Remove the file from the list
        updatedFiles[step][index].splice(fileIndex, 1);
        // Optionally, check if the list is empty and handle accordingly
        if (updatedFiles[step][index].length === 0) {
          delete updatedFiles[step][index];
        }
      }
      return updatedFiles;
    });
  
    setUploadDrafts(currentDrafts => {
      const updatedDrafts = { ...currentDrafts };
      if (updatedDrafts[step] && updatedDrafts[step][index]) {
        updatedDrafts[step][index].splice(fileIndex, 1);
        if (updatedDrafts[step][index].length === 0) {
          delete updatedDrafts[step][index];
        }
      }
      saveToLocalStorage('uploadDrafts', updatedDrafts);
      return updatedDrafts;
    });
  };
  

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Upload Evidence" />
      <MainContainer>
        <StepContainer>
          {standards.map((standard, index) => (
            <StepWrapper key={index}>
              <StepStyle completed={activeStep >= index}>
                <StepCount>{index + 1}</StepCount>
              </StepStyle>
              <StepsLabelContainer>
                <StepLabel>{standard.standardName}</StepLabel>
              </StepsLabelContainer>
            </StepWrapper>
          ))}
          <ProgressLine activeStep={activeStep} totalSteps={standards.length} />
        </StepContainer>
        <ButtonsContainer>
          <ButtonStyle onClick={prevStep} disabled={activeStep === 0}>Previous</ButtonStyle>
          <ButtonStyle onClick={nextStep} disabled={activeStep === standards.length - 1}>Next</ButtonStyle>
        </ButtonsContainer>
        <br /><br /><br /><br /><br />
        {standards[activeStep]?.indicators.map((indicator, index) => (
  <div key={`${activeStep}-${index}`} className="card">
    <h4>{indicator.label}</h4>
    <FileUpload 
      name={`upload-${activeStep}-${index}`}
      multiple 
      accept="*"
      maxFileSize={10000000}
      customUpload={true}
      onSelect={(e) => handleFileSelect(e, index)}
      emptyTemplate={<p>Drag and drop files here to upload</p>}
    />
    {uploadDrafts[activeStep] && uploadDrafts[activeStep][index] && (
      <ul>
        {uploadDrafts[activeStep][index].map((file, fileIdx) => (
          <li key={fileIdx}>
            {file.name} - {file.size} bytes
            <button onClick={() => deleteFile(activeStep, index, fileIdx)}>Delete</button>
          </li>
        ))}
      </ul>
    )}
  </div>
))}

      </MainContainer>
    </DefaultLayout>
  );
};

export default UploadEvidence;
