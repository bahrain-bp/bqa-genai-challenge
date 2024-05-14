
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import styled from 'styled-components';
import DefaultLayout from '../layout/DefaultLayout';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FileUpload } from 'primereact/fileupload';
//import { useTranslation } from 'react-i18next';
//import Loader from '../common/Loader';

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

const StyledFileDisplay = styled.div`
  padding: 8px 16px;
  margin: 5px 2px;
  background-color: #f6f6f6;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: ;
  justify-content: space-between;
  transition: background-color 0.2s, box-shadow 0.2s;

  &:hover {
    background-color: #ffffff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
`;


const DeleteIcon = styled.i`
  cursor: pointer;
  color: #f44336; // Google's material design color for destructive actions
  &:hover {
    color: #d32f2f; // Darken the color on hover
  }
`;


const IndicatorName = styled.h4`
  font-size: 20px;
  color: ;
  margin-top: 0;
  margin-bottom: 5px; // Space below each indicator name
  padding: 10px; // Adds padding around the text for better spacing
  background-color: #fff; // Ensures background color matches your design, if needed
  border-radius: 5px; // Optionally round the corners if you prefer
`;


const SectionTitle = styled.h2`
  font-size: 28px;
  color: #2ECC71; // A green shade that matches your step indicators
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const UploadEvidence = () => {
  const [standards, setStandards] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const apiURL = import.meta.env.VITE_API_URL;




  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const response = await fetch(`${apiURL}/standards`);

        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        const rawData = await response.json();
        const standardsMap = new Map();
        rawData.forEach((item:any) => {
        if(item.status=="unarchived"){
          if (!standardsMap.has(item.standardId)) {
            standardsMap.set(item.standardId, { ...item, indicators: [] });
          }
          standardsMap.get(item.standardId).indicators.push({
            label: item.indicatorName,
            uploadSection: item.uploadSection,
            id:item.indicatorId
          });
        }
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

    if (!standard || !indicator) {
        console.error('Invalid standard or indicator data');
        toast.error('Invalid data provided for upload');
        setIsUploading(false);
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
            const response = await fetch(`${apiURL}/uploadS3`, {
                method: 'POST',
                body: formData,
                headers: {
                    'file-name': file.name,
                    'bucket-name': 'uni-artifacts',
                    'folder-name': 'BUB',
                    'subfolder-name': `${standard.standardId}`,
                    'subSubfolder-name': `${indicator.id}`,
                    'content-type': 'application/pdf' // Assuming all files are PDF
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to upload file: ${errorText}`);
            }

            // Log file info and refresh file list
            console.log("Uploaded file:", file.name);
            fetchUploadedFiles(); // Assuming this fetches and logs files
            toast.success('File uploaded successfully');
           

        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Upload error: ' + error.message);
        }
    }
    setIsUploading(false);
};

//fetch uploaded folders TRY#1
const fetchUploadedFiles = async () => {
  if (standards.length === 0 || activeStep < 0 || activeStep >= standards.length) {
      return; // Guard clause
  }

  const currentStandard = standards[activeStep];

  const url = `${apiURL}/files`;

  try {
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'bucket-name': 'uni-artifacts',
              'folder-name': 'BUB',
              'subfolder-name': `${currentStandard.standardId}`,
          },
      });

      if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      const files = data.files; // Ensure this matches the structure you log in Lambda

      const filesByIndicator = files.reduce((acc:any, file:any) => {
          // Path structure: 'BUB/StandardID/IndicatorID/filename'
          const parts = file.Key.split('/');
          const indicatorId = parts[2]; // This assumes the indicator ID is the third part
          if (!acc[indicatorId]) {
              acc[indicatorId] = [];
          }
          acc[indicatorId].push({ name: file.Key });
          return acc;
      }, {});

      setUploadedFiles(prev => ({
          ...prev,
          [currentStandard.standardId]: filesByIndicator
      }));
  } catch (error) {
      console.error('Error fetching uploaded files:', error);
      toast.error(`Error fetching uploaded files: ${error.message}`);

  }
};


const handleFileDelete = async (fileKey:any, standardId:any, indicatorId:any) => {
  try {
    // Construct the API endpoint URL
    const url = `${apiURL}/deleteFile`; // Replace with your actual endpoint URL

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucketName: 'uni-artifacts', // Your S3 bucket name
        key: fileKey // This should be the full path of the file in S3
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }

    // Parse JSON response if necessary
    //const result = await response.json();
    toast.success('File deleted successfully');


    // Update local state to remove the file from the list
    setUploadedFiles(prevFiles => {
      const updatedFiles = {...prevFiles};
      const filteredFiles = updatedFiles[standardId][indicatorId].filter(file => file.name !== fileKey);
      updatedFiles[standardId][indicatorId] = filteredFiles;

      return updatedFiles;
    });

  } catch (error) {
    console.error('Delete file error:', error);
    toast.error(`Failed to delete file: ${error.message}`);
  }
};

useEffect(() => {
  fetchUploadedFiles();
}, [activeStep, standards]); // Re-fetch when these change


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
      <SectionTitle>{standards[activeStep]?.standardId}: {standards[activeStep]?.standardName}</SectionTitle> 

        <StepContainer>
          {standards.map((standard, index) => (
            <StepWrapper key={index}>
              <StepStyle completed={activeStep >= index}>
                <StepCount>{index + 1}</StepCount>
              </StepStyle>
              <StepsLabelContainer>

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
        <br />
        
         
{standards[activeStep]?.indicators.map((indicator:any, index:any) => (
        <div key={`${activeStep}-${index}`} className="card">
                      {/* <StandardName>{standards[activeStep].standardName}</StandardName> */}

            <IndicatorName>{indicator.id}: {indicator.label}</IndicatorName>
            <FileUpload
                name={`upload-${activeStep}-${index}`}
                url='https://l1ca6m1ik7.execute-api.us-east-1.amazonaws.com/uploadS3'
                multiple
                accept="*"
                auto={true}
                maxFileSize={10000000} // 10 MB limit
                onSelect={(e) => handleFileChange(e.files, standards[activeStep], indicator)}
                onError={(e) => {
                    console.error('Upload Error:', e);
                }}

                emptyTemplate={<p>Drag and drop files here to upload</p>}
            />
            <div style={{ marginTop: '10px' }}>
            {
    (uploadedFiles[standards[activeStep]?.standardId]?.[indicator.id] || []).map(file => (
        <StyledFileDisplay key={file.name}>
            <i className="pi pi-file" style={{ fontSize: '1.2em' }}></i>
           {file.name.split('/').pop()}
            <DeleteIcon className="pi pi-times"   onClick={() => handleFileDelete(file.name, standards[activeStep]?.standardId, indicator.id)}
 />
        </StyledFileDisplay>
    ))
}

            </div>
        </div>
    ))
}

      </MainContainer>
    </DefaultLayout>
  );
};

export default UploadEvidence;