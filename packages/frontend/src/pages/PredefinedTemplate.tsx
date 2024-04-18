import React, { useState, useEffect } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import './PredefinedTemplate.css'; // Importing CSS file
import AWS from 'aws-sdk';

const PredefinedTemplate: React.FC = () => {
  const [recordData, setRecordData] = useState({
    entityType: '',
    entityId: '',
    standardName: '',
    description: '',
    documentName: '',
    documentURL: '', // Initialize documentURL state
    dateCreated: '',
    status: 'unarchived',
  });
  const [records, setRecords] = useState<any[]>([]); // Initialize state to store fetched records

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = event.target;
    setRecordData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
 
  


  const getStandardDisplayName = (standardName: string): string => {
    switch (standardName.toLowerCase()) {
      case 'standard1':
        return 'Standard 1: Governance and Management';
      case 'standard2':
        return 'Standard 2: Human Resources Management';
      case 'standard3':
        return 'Standard 3: Quality Assurance and Enhancement';
      case 'standard4':
        return 'Standard 4: Infrastructure, Information and Communications Technology (ICT) and Learning Resources';
      case 'standard5':
        return 'Standard 5: Management of Academic Affairs';
      case 'standard6':
        return 'Standard 6: Teaching, Learning and Assessment';
      case 'standard7':
        return 'Standard 7: Research and Postgraduate Studies';
      case 'standard8':
        return 'Standard 8: Community Engagement';
      case 'standard9':
        return 'Standard 9: Student Support Services';
      default:
        return '';
    }
  };

  const createRecord = async () => {
    try {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        throw new Error('Please select a file.');
      }
      const file = fileInput.files[0];

      // Handle file upload
      const selectedStandard = recordData.standardName; // Get the selected standard value
      await handleFileSelect(file, selectedStandard);

      // Create record in DynamoDB
      const documentURL = `https://d2qvr68pyo44tt.cloudfront.net/${selectedStandard}/${file.name}`;
      const newRecordData = {
        ...recordData,
        documentName: file.name,
        documentURL,
      };
      const response = await fetch('https://tds1ye78fl.execute-api.us-east-1.amazonaws.com/standards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecordData),
      });
      if (!response.ok) {
        throw new Error('Failed to create record');
      }
      const data = await response.json();
      console.log('New record created:', data);
      fetchRecords();
      setRecordData({
        entityType: '',
        entityId: '',
        standardName: '',
        description: '',
        documentName: '',
        documentURL: '',
        dateCreated: '',
        status: 'unarchived',
      });
      alert('Record created successfully!');
    } catch (error) {
      console.error('Error creating record:', error);
      alert('Failed to create record');
    }
  };
  

  const fetchRecords = async () => {
    try {
      const response = await fetch('https://tds1ye78fl.execute-api.us-east-1.amazonaws.com/standards');
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      const data: any[] = await response.json(); // Assuming your records have type any
      
      // Sort records based on the numeric value in the standardName
      const sortedRecords = data
        .filter((record: any) => record.documentURL && record.status !== 'archived') // Filter based on documentURL and status
        .sort((a: any, b: any) => {
          const standardNameA = parseInt(a.standardName.replace('Standard', ''));
          const standardNameB = parseInt(b.standardName.replace('Standard', ''));
          return standardNameA - standardNameB;
        });
  
      setRecords(sortedRecords); // Update state with sorted records
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };
  
  

  useEffect(() => {
    

    fetchRecords(); // Fetch records when the component mounts
  }, []);

  async function uploadToS3Evidence(fileData: Blob | File, fileName: string, folderName: string) {
    try {
      const s3 = new AWS.S3();

      const params = {
        Bucket: 'bqa-standards-upload',
        Key: folderName + '/' + fileName,
        Body: fileData
      };

      const uploadResult = await s3.upload(params).promise();

      return { message: 'File uploaded successfully', location: uploadResult.Location };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  async function handleFileSelect(file: File, selectedFolder: string) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      if (e.target) {
        const fileContent = e.target.result as string;
  
        const uploadParams = {
          body: new Blob([fileContent], { type: file.type }),
          headers: {
            'Content-Type': file.type,
            'file-name': file.name
          }
        };
  
        uploadToS3Evidence(uploadParams.body, uploadParams.headers['file-name'], selectedFolder)
          .then(response => {
            console.log(response);
            alert('File uploaded successfully!');
          })
          .catch(error => {
            console.error('Error uploading file:', error);
            alert('Failed to upload file');
          });
      }
    };
  
    fileReader.readAsBinaryString(file);
  }



  
  

  return (
    <DefaultLayout>
      <div>
        <h6 className="m-b-20">Create New Standard</h6>
       
        <div className="form-group">
          <label>Choose Standard :</label>
         <select name="standardName" value={recordData.standardName} onChange={handleChange}>
          <option value="">Select a Standard</option>
          <option value="Standard1">Standard 1: Governance and Management</option>
          <option value="Standard2">Standard 2: Human Resources Management</option>
          <option value="Standard3">Standard 3: Quality Assurance and Enhancement</option>
          <option value="Standard4">Standard 4: Infrastructure, Information and Communications Technology (ICT) and Learning Resources</option>
          <option value="Standard5">Standard 5: Management of Academic Affairs</option>
          <option value="Standard6">Standard 6: Teaching, Learning and Assessment</option>
          <option value="Standard7">Standard 7: Research and Postgraduate Studies</option>
          <option value="Standard8">Standard 8: Community Engagement</option>
          <option value="Standard9">Standard 9: Student Support Services</option>
          <option value="Other">Other</option>
        </select>
        {recordData.standardName === 'Other' && (
          <input
            type="text"
            name="standardName"
            placeholder="Enter Standard Name"
            value={recordData.standardName} // Ensure input value reflects state value
           
            onChange={handleChange}
          />
        )}
        </div>
        <div className="form-group">
          <label>Upload Document:</label>
          <input type="file" name="documentName" value={recordData.documentName} onChange={handleChange}/>
        </div>
        <div className="form-group">
          <label>Document Description:</label>
          <input type="text" name="description" value={recordData.description} onChange={handleChange} />
        </div>
        <div className="form-group">
  <label>Status:</label>
  <input type="text" name="status" value={recordData.status} onChange={handleChange} readOnly />
</div>

        <button onClick={createRecord}>Save</button>
      </div>

      <div>
      <div className="predefined-header">
        <h2>Predefined Templates</h2>
        <h6>In here, you can find predefined templates that can help guide you to the required documents.</h6>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
       
        {[...new Map(
          records
            .filter(record => record.documentURL && record.status !== 'archived') // Filter based on documentURL and status
            .map(record => [record.standardName, record]) // Map each record to its standardName and the record itself
        )].map(([standardName, record], index) => (
          <div key={index} className="record">
           


            <div className="rounded-xl border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="scard-block">
          <div className="circle-background">
              <svg
                className="fill-primary dark:fill-white svg-icon"
                width="30"
                height="30"
                viewBox="0 0 22 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
            <path
              d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z"
              fill=""
            />
            <path
              d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
              fill=""
            />
            </svg>
            </div>

            <a href={`EvidenceFiles/${record.standardName}`} className="link-unstyled">
   
    <h6 className="m-b-20">{getStandardDisplayName(standardName)}</h6></a>
      </div>
        </div>


          </div>
        ))}
      </div>
      </div>
    </DefaultLayout>
  );
};

export default PredefinedTemplate;
