import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import './BqaDash1.css'; // Custom CSS file for progress bars
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Loader from '../common/Loader';
//import AWS from 'aws-sdk';
const BqaDash1 = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  /*const handleUniversitySelect = (email:any) => {
    navigate(`/BqaDash2/${email}`);
  };*/
  const [users, setUsers] = useState<
    { Username: string; Attributes: { Name: string; Value: string }[] }[]
  >([]);
  const { t } = useTranslation(); // Hook to access translation functions
  //const [imageUrl, setImageUrl] = useState('');
  //const [logos, setLogos] = useState<string[]>([]);
  useEffect(() => {
    //66xzg471hh
    //prod u1oaj2omi2
    const fetchCognitoUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/getUsers`);
        const data = await response.json();
        if (response.ok) {
          // Filter out users where the 'name' attribute is 'BQA reviewer'
          const filteredUsers = data.filter(
            (user: { Attributes: { Name: string; Value: string }[] }) => {
              const nameValue = getAttributeValue(user.Attributes, 'name');
              return nameValue !== 'BQA Reviewer';
            },
          );
          console.log(data); // Users data
          setUsers(filteredUsers); // Update the users state with the fetched data
        } else {
          console.error('Error fetching users:', data.error);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchCognitoUsers(); // Call the fetchCognitoUsers function

    // const fetchLogos = async () => {
    //   const url = 'https://66xzg471hh.execute-api.us-east-1.amazonaws.com/files'; // Replace with your actual API Gateway URL
    //   try {
    //     const response = await fetch(url, {
    //       method: 'GET',
    //       headers: {
    //         'bucket-name': 'uni-artifacts',
    //         'folder-name': 'bahrainPolytechnic',// it should be user attribute name
    //         'subfolder-name': 'logos'
    //       }
    //     });
    //     if (response.ok) {
    //       const data = await response.json();
    //       setLogos(data.files); // Assuming the Lambda returns an array of file information
    //       console.log('Logos fetched successfully:', data.files);
    //     } else {
    //       const errorData = await response.json();
    //       console.error('Failed to fetch logos:', errorData);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching logos:', error);
    //   }
    // };
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
  // Function to find attribute value by name
  const getAttributeValue = (
    attributes: { Name: string; Value: string }[],
    attributeName: string,
  ): string => {
    const attribute = attributes.find((attr) => attr.Name === attributeName);
    return attribute ? attribute.Value : 'N/A'; // Returns 'N/A' if attribute not found
  };

  //   // Function to remove query parameters from a URL
  // const removeQueryParams = (url: string): string => {
  //   try {
  //     const urlObj = new URL(url);
  //     urlObj.search = ''; // Remove query parameters
  //     return urlObj.toString(); // Return the modified URL without query parameters
  //   } catch (error) {
  //     console.error('Invalid URL:', url);
  //     return ''; // Return empty string for invalid URLs
  //   }
  // };
  // // // Create an instance of the S3 service
  //  const s3 = new AWS.S3();
  //  useEffect(() => {
  //   const getSignedUrl = async () => {
  //     const params = {
  //       Bucket: 'uni-artifacts',
  //          Key: 'bahrainPolytechnic/logos/UOB%20LOGO.png',
  //     };

  //     try {
  //       const signedUrl = await s3.getSignedUrlPromise('getObject', params);
  //       setImageUrl(signedUrl);
  //     } catch (error) {
  //       console.error('Error generating signed URL:', error);
  //     }
  //   };

  //   getSignedUrl(); // Generate the signed URL
  // }, []);

  // // // Parameters for getObject method
  // const params = {
  //   Bucket: 'uni-artifacts',
  //   Key: 'bahrainPolytechnic/logos', // Replace with the actual key of your image in S3
  // };

  // // // Retrieve the object URL from S3
  // s3.getObject(params, (err, data) => {
  //   if (err) {
  //     console.error('Error retrieving image from S3:', err);
  //   } else {
  //     // Construct the object URL
  //     const objectUrl = URL.createObjectURL(new Blob([data.Body as BlobPart]));
  //         setImageUrl(objectUrl);
  //   }
  // });

  // // Clean up the object URL when component unmounts
  // if (imageUrl) {
  //   URL.revokeObjectURL(imageUrl);
  // }

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Breadcrumb pageName={t('bqaReviewerDashboard')} />
      <div className="container">
        <div className="flex justify-end py-4">
          {/* Add university */}
          <button className="px-5 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-opacity-50">
            <Link to={`/AddUni`}>{t('addUniversity')}</Link>
          </button>
        </div>
        <div className="row">
          {/* Add logo for each university */}
          {users.map((user) => (
            <div
              key={user.Username}
              className="col-md-4 col-sm-6"
              style={{ cursor: 'pointer' }}
              onClick={() =>
                navigate(
                  `/BqaDash2/${getAttributeValue(user.Attributes, 'name')}`,
                  {
                    state: {
                      uniName: getAttributeValue(user.Attributes, 'name'),
                    },
                  },
                )
              }
            >
              <div
                className="rounded-xl border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark"
                style={{ marginBottom: '20px' }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h3 style={{ marginBottom: '10px' }}>
                    {getAttributeValue(user.Attributes, 'name')}
                  </h3>
                  <div className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium indicator bg-success text-success">
                    {t('completed')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default BqaDash1;