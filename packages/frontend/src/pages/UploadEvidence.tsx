import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import styled from 'styled-components';
import DefaultLayout from '../layout/DefaultLayout';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FileUpload } from 'primereact/fileupload';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import CSS
import { confirmAlert } from 'react-confirm-alert'; // Fix: npm install react-confirm-alert

//import { useTranslation } from 'react-i18next';
//import Loader from '../common/Loader';
import { fetchUserAttributes } from 'aws-amplify/auth';
import Modal from 'react-modal';

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
  flex:;
  position: relative;
  display: flex;
  justify-content:; // Center the circle within each segment
`;

interface ProgressLineProps {
  activeStep: number;
  totalSteps: number;
}

// Apply the interface to your styled component
const ProgressLine = styled.div<ProgressLineProps>`
  height: 9px;
  background: #2ecc71;
  width: ${(props) =>
    `calc(${(props.activeStep / (props.totalSteps - 1)) * 100}% - 10px)`};
  position: absolute;
  top: 16px;
  left: 1px;
  z-index: -8;
`;

interface StepStyleProps {
  completed: boolean;
}

const StepStyle = styled.div<StepStyleProps>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ completed }) => (completed ? '#2ECC71' : '#FFFFFF')};
  border: 3px solid ${({ completed }) => (completed ? '#2ECC71' : '#F3E7F3')};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; // Ensures correct positioning within StepWrapper
  z-index: 1; // Makes sure it appears above the progress line
`;

const StepCount = styled.span`
  font-size: 19px;
  color: #2ecc71;
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
  color: #2ecc71;
  cursor: pointer;
  :disabled {
    color: #b1b1b1;
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
  align-items:;
  justify-content: space-between;
  transition:
    background-color 0.2s,
    box-shadow 0.2s;

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
  color:;
  margin-top: 0;
  margin-bottom: 5px; // Space below each indicator name
  padding: 10px; // Adds padding around the text for better spacing
  background-color: #fff; // Ensures background color matches your design, if needed
  border-radius: 5px; // Optionally round the corners if you prefer
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  color: #2ecc71; // A green shade that matches your step indicators
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;
const FinishButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end; // Aligns the button to the right
  margin-top: 10px;
`;

const FinishButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: #ffffff;
  background-color: #2ecc71;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #27ae60;
  }
`;

// Custom styles for the modal
const customStyles = {
  content: {
    top: '30%', // Adjusted to position the modal higher
    left: '55%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '400px',
    padding: '20px',
    borderRadius: '10px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};
const CompletionMessage = styled.div`
  top: 10px;
  left: 10px;
  color: #2ecc71;
  font-size: 20px;
  background-color: white;
  padding: 5px 10px; // Adds
  display: inline-block;

`;

const UploadEvidence = () => {
  const [standards, setStandards] = useState<any[]>([]); // Using 'any[]' for state typing
  const [activeStep, setActiveStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [universityStatus, setUniversityStatus] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [currentName, setCurrentName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchCurrentUserInfo = async () => {
      try {
        const attributes = await fetchUserAttributes();
        const name: any = attributes.name;
        setCurrentName(name);
        const email: any = attributes.email;
        setUserEmail(email);
      } catch (error) {
        console.error('Error fetching current user info:', error);
      }
    };

    fetchCurrentUserInfo();
  }, []);

  const apiURL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchUniversityStatus = async () => {
      try {
        const response = await fetch(`${apiURL}/uniStatus/${currentName}`);
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        const data = await response.json();
        setUniversityStatus(data.status);
      } catch (error) {
        console.error('Error fetching university status:', error);
        toast.error(
          `Error fetching university status: ${error instanceof Error ? error.message : 'An error occurred'}`,
        );
      }
    };

    if (currentName) {
      fetchUniversityStatus();
    }
  }, [currentName]);

  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const response = await fetch(
          `https://tds1ye78fl.execute-api.us-east-1.amazonaws.com/standards`,
        );
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        const rawData = await response.json();
        const standardsMap = new Map();

        rawData.forEach((item: any) => {
          if (item.status === 'unarchived') {
            if (!standardsMap.has(item.standardId)) {
              standardsMap.set(item.standardId, { ...item, indicators: [] });
            }

            // Get the current list of indicators for this standard
            const existingIndicators = standardsMap.get(
              item.standardId,
            ).indicators;
            // Create a Set to filter out duplicate indicator IDs
            const indicatorSet = new Set(
              existingIndicators.map((ind: any) => ind.id),
            );
            // Check if the current item's indicatorId is already in the set
            if (!indicatorSet.has(item.indicatorId)) {
              existingIndicators.push({
                label: item.indicatorName,
                uploadSection: item.uploadSection,
                id: item.indicatorId,
              });
            }
          }
        });

        // Convert the map to an array and sort standards
        const sortedStandards = Array.from(standardsMap.values());
        sortedStandards.sort((a: any, b: any) =>
          a.standardId.localeCompare(b.standardId, undefined, {
            numeric: true,
          }),
        );

        // Sort indicators inside each standard
        standardsMap.forEach((standard: any) => {
          standard.indicators.sort((a: any, b: any) => {
            const idA = a.id ?? ''; // Fallback to empty string if null
            const idB = b.id ?? ''; // Fallback to empty string if null
            return idA.localeCompare(idB, undefined, { numeric: true });
          });
        });

        setStandards(sortedStandards);
      } catch (error) {
        console.error('Error fetching standards:', error);
        toast.error(
          `Error fetching standards: ${error instanceof Error ? error.message : 'An error occurred'}`,
        );
      }
    };

    fetchStandards();
  }, []);

  const handleFileChange = async (
    files: any,
    standard: any,
    indicator: any,
  ) => {
    setIsUploading(true);

    if (!standard || !indicator) {
      console.error('Invalid standard or indicator data');
      toast.error('Invalid data provided for upload');
      setIsUploading(false);
      return;
    }

    for (let file of files) {
      if (file.size > 10000000) {
        // 10 MB limit
        toast.error('File size should not exceed 10 MB');
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        console.log('Email:', userEmail);
        const response = await fetch(`${apiURL}/uploadS3`, {
          method: 'POST',
          body: formData,
          headers: {
            'user-email': userEmail, // Add the user's email to the headers
            'file-name': String(file.name),
            'bucket-name': 'uni-artifacts',
            'folder-name': currentName,
            'subfolder-name': `${standard.standardId}`,
            'subsubfolder-name': `${indicator.id}`,
            'content-type': 'application/pdf', // Assuming all files are PDF
          },
        });
        console.log(file.name);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to upload file: ${errorText}`);
        } 

      // Testing if the email gets sent when uploading
      // try {
      //   const response = await fetch(`${apiURL}/email`, {
      //     method: 'POST',
      //     body: formData,
      //     headers: {
      //       'user-email': userEmail, // Add the user's email to the headers
      //       'file-name': String(file.name),
      //     },
      //   });
      //   console.log(file.name);
      //   if (!response.ok) {
      //     const errorText = await response.text();
      //     throw new Error(`Failed to upload file: ${errorText}`);
      //   } 

        // Log file info and refresh file list
        console.log('Uploaded file:', file.name);
        fetchUploadedFiles(); // Assuming this fetches and logs files
        toast.success('File uploaded successfully');
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred';
        console.error('Upload error:', message);
        toast.error(`Upload error: ${message}`);
      }
    }
    setIsUploading(false);
  };


  //fetch uploaded folders TRY#1
  const fetchUploadedFiles = async () => {
    if (
      standards.length === 0 ||
      activeStep < 0 ||
      activeStep >= standards.length
    ) {
      return; // Guard clause
    }

    const currentStandard = standards[activeStep];
    const url = `${apiURL}/files`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'bucket-name': 'uni-artifacts',
          'folder-name': currentName,
          'subfolder-name': `${currentStandard.standardId}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      const files = data.files; // Ensure this matches the structure you log in Lambda

      // Filter out files containing "-split" in their name
      const filteredFiles = files.filter(
        (file: any) => !file.Key.includes('-split'),
      );

      const filesByIndicator = filteredFiles.reduce((acc: any, file: any) => {
        // Path structure: 'BUB/StandardID/IndicatorID/filename'
        const parts = file.Key.split('/');
        const indicatorId = parts[2]; // This assumes the indicator ID is the third part
        if (!acc[indicatorId]) {
          acc[indicatorId] = [];
        }
        acc[indicatorId].push({ name: file.Key });
        return acc;
      }, {});

      setUploadedFiles((prev) => ({
        ...prev,
        [currentStandard.standardId]: filesByIndicator,
      }));
    } catch (error) {
      // Check if error is an instance of Error and then access its message property
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error fetching uploaded files:', errorMessage);
      // toast.error(`Error fetching uploaded files: ${errorMessage}`);
    }
  };

  const handleFileDelete = async (
    fileKey: any,
    standardId: any,
    indicatorId: any,
  ) => {
    confirmAlert({
      title: 'Confirm deletion',
      message: 'Are you sure you want to delete this file?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
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
                  key: fileKey, // This should be the full path of the file in S3
                }),
              });

              if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
              }

              // Parse JSON response if necessary
              //const result = await response.json();
              toast.success('File deleted successfully');

              // Update local state to remove the file from the list
              setUploadedFiles((prevFiles: any) => {
                const updatedFiles = { ...prevFiles };
                const filteredFiles = updatedFiles[standardId][
                  indicatorId
                ].filter((file: any) => file.name !== fileKey);
                // Assuming setUploadedFiles is a state setter function
                // Replace it with the appropriate state setter function from your component
                updatedFiles[standardId][indicatorId] = filteredFiles;

                return updatedFiles;
              });
            } catch (error) {
              const errorMessage =
                error instanceof Error
                  ? error.message
                  : 'An unknown error occurred';
              console.error('Delete file error:', errorMessage);
              toast.error(`Failed to delete file: ${errorMessage}`);
            }
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };
  const fileUploadUrl = `${apiURL}/uploadS3`;
  useEffect(() => {
    fetchUploadedFiles();
  }, [activeStep, standards]); // Re-fetch when these change

  const nextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFinishUploading = async () => {
    try {
      const response = await fetch(`${apiURL}/updateStatus/${currentName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uniName: currentName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      toast.success('Upload finalized successfully');
      setUniversityStatus('completed');
      setShowModal(false); // Close the modal after the user clicks "Yes"
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error finalizing upload:', errorMessage);
      toast.error(`Failed to finalize upload: ${errorMessage}`);
      setShowModal(false); // Ensure the modal closes even on error
    }
  };

  return (
    <DefaultLayout>
      {/*<Loading/>*/}
      <Breadcrumb pageName="Upload Evidence" />
      {universityStatus === 'completed' && (
        <CompletionMessage>
          You have submited The final vesion to BQA
        </CompletionMessage>
      )} 
      <MainContainer>
        {universityStatus === 'in-progress' && (
          <FinishButtonContainer>
            <FinishButton onClick={() => setShowModal(true)}>
              Submit Final Version
            </FinishButton>
          </FinishButtonContainer>
        )}
        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          contentLabel="Confirm Finish Uploading"
          style={customStyles} // Apply custom styles here
        >
          <h2>Are you sure you want to finalize your upload?</h2>
          <ButtonsContainer>
            <ButtonStyle onClick={() => setShowModal(false)}>
              Cancel
            </ButtonStyle>
            <ButtonStyle onClick={handleFinishUploading}>Yes</ButtonStyle>
          </ButtonsContainer>
        </Modal>

        <SectionTitle>
          {standards[activeStep]?.standardId}:{' '}
          {standards[activeStep]?.standardName}
        </SectionTitle>

        <StepContainer>
          {standards.map((_, index) => (
            <StepWrapper key={index}>
              <StepStyle completed={activeStep >= index}>
                <StepCount>{index + 1}</StepCount>
              </StepStyle>
              <StepsLabelContainer></StepsLabelContainer>
            </StepWrapper>
          ))}
          <ProgressLine activeStep={activeStep} totalSteps={standards.length} />
        </StepContainer>
        <ButtonsContainer>
          <ButtonStyle onClick={prevStep} disabled={activeStep === 0}>
            Previous
          </ButtonStyle>
          <ButtonStyle
            onClick={nextStep}
            disabled={isUploading || activeStep === standards.length - 1}
          >
            {isUploading ? 'Uploading...' : 'Next'}
          </ButtonStyle>
        </ButtonsContainer>
        <br />

        {standards[activeStep]?.indicators.map((indicator: any, index: any) =>
          indicator.id && indicator.label ? (
            <div key={`${activeStep}-${index}`} className="card">
              {/* <StandardName>{standards[activeStep].standardName}</StandardName> */}

              <IndicatorName>
                {indicator.id}: {indicator.label}
              </IndicatorName>

              <FileUpload
                name={`upload-${activeStep}-${index}`}
                url={fileUploadUrl}
                multiple
                accept="*"
                auto={true}
                maxFileSize={10000000} // 10 MB limit
                onSelect={(e) =>
                  handleFileChange(e.files, standards[activeStep], indicator)
                }
                onError={(e) => {
                  console.error('Upload Error:', e);
                }}
                emptyTemplate={<p>Drag and drop files here to upload</p>}
              />
              <div style={{ marginTop: '10px' }}>
                {(
                  uploadedFiles[standards[activeStep]?.standardId]?.[
                    indicator.id
                  ] || []
                ).map((file: any) => (
                  <StyledFileDisplay key={file.name}>
                    <i className="pi pi-file" style={{ fontSize: '1.2em' }}></i>
                    {file.name.split('/').pop()}
                    <DeleteIcon
                      className="pi pi-times"
                      onClick={() =>
                        handleFileDelete(
                          file.name,
                          standards[activeStep]?.standardId,
                          indicator.id,
                        )
                      }
                    />
                  </StyledFileDisplay>
                ))}
              </div>
            </div>
          ) : null,
        )}
      </MainContainer>
    </DefaultLayout>
  );
};

export default UploadEvidence;
