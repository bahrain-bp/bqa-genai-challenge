import React, { useState, useEffect } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FileUpload } from 'primereact/fileupload';

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
  const [activeStep, setActiveStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});


  
  useEffect(() => {
    //fetchStandards();
    //fetchUploadedFiles();
  }, [activeStep]);  // Fetch files every time active step changes

  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const response = await fetch(`https://tds1ye78fl.execute-api.us-east-1.amazonaws.com/standards`);
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        const rawData = await response.json();
        const standardsMap = new Map();
        rawData.forEach((item:any) => {
          if (!standardsMap.has(item.standardId)) {
            standardsMap.set(item.standardId, { ...item, indicators: [] });
          }
          standardsMap.get(item.standardId).indicators.push({
            label: item.indicatorName,
            uploadSection: item.uploadSection,
            id:item.indicatorId
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



  const handleFileChange = async (files:any, standard:any, indicator:any) => {
    setIsUploading(true);

    // Ensure all necessary data is available
    if (!standard || !indicator) {
      console.error('Invalid standard or indicator data');
      toast.error('Invalid data provided for upload');
      setIsUploading(false);
        console.log("Standard Data:", standards[activeStep]);
        console.log("Indicator Data:", indicator);

        return;
    }

    for (let file of files) {
        if (file.size > 10000000) { // 10 MB limit
            toast.error('File size should not exceed 10 MB');
            continue;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('https://l1ca6m1ik7.execute-api.us-east-1.amazonaws.com/uploadS3', {
                method: 'POST',
                body: formData,
                headers: new Headers({
                  'file-name': (file.name),
                    'bucket-name': 'uni-artifacts',
                    'folder-name': 'UOB',
                    'subfolder-name': (`${standard.standardId}/${indicator.id}`),
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to upload file: ${errorText}`);
            }

           // const uploadedFile = await response.json(); // Adjust based on actual response structure 
            toast.success('File uploaded successfully');
            
            //console.log("Updating state with new file: ", uploadedFile);



        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Upload error: ' + error.message);
        }
    }
    setIsUploading(false);
};


//fetch uploaded folders TRY#1

// const fetchUploadedFiles = async () => {
//   if (standards.length === 0 || activeStep < 0 || activeStep >= standards.length) {
//     return; // Guard against fetching if no standards are loaded or activeStep is out of bounds
//   }

//   const currentStandard = standards[activeStep];
//   const url = `https://l1ca6m1ik7.execute-api.us-east-1.amazonaws.com/files`;

//   try {
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json',
//         //'file-name': (files.name),
//                     'bucket-name': 'uni-artifacts',
//                     'folder-name': 'UOB',
//                     //'subfolder-name': (`${standard.standardId}/${indicator.id}`), 
//       },
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP status ${response.status}`);
//     }
//     const data = await response.json();
//     setUploadedFiles(prev => ({ ...prev, [currentStandard.standardId]: data }));
//   } catch (error) {
//     console.error('Error fetching uploaded files:', error);
//     toast.error(`Error fetching uploaded files: ${error.message}`);
//   }
// };

// useEffect(() => {
//   fetchUploadedFiles();
// }, [activeStep, standards]);






//fetch uploaded folders TRY#2

// useEffect(() => {
//   const fetchUploadedFilesForCurrentStep = async () => {
//     const currentStandard = standards[activeStep];
//     if (currentStandard) {
//       try {
//         const response = await fetch(`https://l1ca6m1ik7.execute-api.us-east-1.amazonaws.com/files/${currentStandard.standardId}/${currentStandard.indicatorId}`);
//         if (!response.ok) {
//           throw new Error(`HTTP status ${response.status}`);
//         }
//         const files = await response.json();
//         setUploadedFiles(prevFiles => ({
//           ...prevFiles,
//           [currentStandard.standardId]: files
//         }));
//       } catch (error) {
//         console.error('Error fetching files:', error);
//         toast.error(`Error fetching files: ${error.message}`);
//       }
//     }
//   };

//   if (standards.length > 0) {
//     fetchUploadedFilesForCurrentStep();
//   }
// }, [activeStep, standards]);  // Add standards to the dependency array if the fetching depends on it




  const nextStep = () => {
    setActiveStep(prevStep => prevStep + 1);
  };

  const prevStep = () => {
    setActiveStep(prevStep => prevStep - 1);
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
          <ButtonStyle onClick={nextStep} disabled={isUploading || activeStep === standards.length - 1}>
            {isUploading ? 'Uploading...' : 'Next'}
          </ButtonStyle>
        </ButtonsContainer>
        <br /><br /><br /><br /><br />
         
   
{standards[activeStep]?.indicators.map((indicator, index) => (
        <div key={`${activeStep}-${index}`} className="card">
          <h4>{indicator.label}</h4>
          {uploadedFiles[standards[activeStep]?.standardId]?.map(file => (
            <p key={file.name}>{file.name}</p> // Display uploaded files
          ))}
    

    <FileUpload
      name={`upload-${activeStep}-${index}`}
      url='https://l1ca6m1ik7.execute-api.us-east-1.amazonaws.com/uploadS3'
      multiple
      accept="*"
      maxFileSize={10000000}  // 10 MB
      onSelect={(e) => handleFileChange(e.files, standards[activeStep], indicator)}
      onError={(e) => {
        console.error('Upload Error:', e);
        // toast.error(`Upload failed: ${e.message || 'See console for more details.'}`);
      }}
      emptyTemplate={<p>Drag and drop files here to upload</p>}
    />
  </div>
))}

      </MainContainer>
    </DefaultLayout>
  );
};

export default UploadEvidence;
