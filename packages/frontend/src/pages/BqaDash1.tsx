import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import './BqaDash1.css'; // Custom CSS file for progress bars
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Loader from '../common/Loader';
import axios from 'axios';

interface User {
  Username: string;
  Attributes: { Name: string; Value: string }[];
  imageUrl: string; // Added imageUrl property
  status: string;
}

const BqaDash1 = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState<User[]>([]); // Updated users type to User[]
  const { t } = useTranslation(); // Hook to access translation functions
  const [imagesFetched, setImagesFetched] = useState<boolean>(false); // Flag to track if images are fetched
  const [statusFetched, setStatusFetched] = useState<boolean>(false); // Flag to track if statuses are fetched
  
  useEffect(() => {
    const fetchCognitoUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/getUsers`);
        const data = await response.json();
        if (response.ok) {
          const filteredUsers = data.filter(
            (user: { Attributes: { Name: string; Value: string }[] }) => {
              const nameValue = getAttributeValue(user.Attributes, 'name');
              return nameValue !== 'BQA Reviewer';
            },
          );
          setUsers(
            filteredUsers.map((user: any) => ({
              ...user,
              imageUrl: '',
              status: '',
            })),
          );
        } else {
          console.error('Error fetching users:', data.error);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
      setLoading(false); //
    };

    fetchCognitoUsers();
  }, [apiUrl]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer); // Cleanup the timeout on component unmount
  }, []);

  useEffect(() => {
    if (!statusFetched && users.length > 0) {
      const fetchStatuses = async () => {
        try {
          const response = await axios.get(`${apiUrl}/listUni`);
          const statusData = response.data;
          console.log('Fetched status data:', statusData);

          setUsers((prevUsers) =>
            prevUsers.map((user) => {
              const uniName = getAttributeValue(user.Attributes, 'name');
              const uniStatus = statusData.find(
                (status: { uniName: string }) => status.uniName === uniName,
              );
              console.log(
                'Matching user:',
                user.Username,
                'with university:',
                uniName,
                'status:',
                uniStatus ? uniStatus.status : 'N/A',
              );
              return { ...user, status: uniStatus ? uniStatus.status : 'N/A' };
            }),
          );
          setStatusFetched(true); // Set flag to prevent further fetching
        } catch (error) {
          console.error('Error fetching university statuses:', error);
        }
      };

      fetchStatuses();
    }
  }, [users, statusFetched, apiUrl]);

  useEffect(() => {
    if (!imagesFetched && users.length > 0) {
      const fetchImages = async () => {
        try {
          const imageRequests = users.map(async (user) => {
            const uniName = getAttributeValue(user.Attributes, 'name');
            const fileKey = `${uniName}/logos/${uniName}.png`;

            const response = await axios.get(
              `${apiUrl}/viewFile?data={"fileKey":"${fileKey}"}`,
              { responseType: 'arraybuffer' },
            );

            if (response.status !== 200) {
              throw new Error('Failed to fetch image');
            }

            const contentType = response.headers['content-type'];

            // Check if the content type is an image
            if (!contentType.startsWith('image/')) {
              throw new Error('Fetched content is not an image');
            }

            const imageData = btoa(
              new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                '',
              ),
            );

            return {
              username: user.Username,
              imageUrl: `data:${contentType};base64,${imageData}`,
            };
          });

          const imageResults = await Promise.all(imageRequests);

          // Update image URLs for all users at once
          setUsers((prevUsers) =>
            prevUsers.map((u) => {
              const imageResult = imageResults.find(
                (result) => result.username === u.Username,
              );
              return imageResult ? { ...u, imageUrl: imageResult.imageUrl } : u;
            }),
          );

          setImagesFetched(true); // Set flag to true after fetching images
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      };

      fetchImages();
    }
  }, [users, imagesFetched]);

  const getAttributeValue = (
    attributes: { Name: string; Value: string }[],
    attributeName: string,
  ): string => {
    const attribute = attributes.find((attr) => attr.Name === attributeName);
    return attribute ? attribute.Value : 'N/A';
  };

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Breadcrumb pageName={t('bqaReviewerDashboard')} />
      <div className="container">
        <div className="flex justify-end py-4">
          <button className="px-5 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-opacity-50">
            <Link to={`/AddUni`}>{t('addUniversity')}</Link>
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {users.map((user) => {
            const isClickable = user.status.toLowerCase() === 'completed';
            const statusClass = isClickable
              ? 'bg-success text-success'
              : 'bg-red-500 text-red-500';

            return (
              <div
                key={user.Username}
                className={`col-md-4 col-sm-6 ${isClickable ? '' : 'cursor-not-allowed opacity-50'}`}
                style={{ cursor: isClickable ? 'pointer' : 'not-allowed' }}
                onClick={() =>
                  isClickable &&
                  navigate(
                    `/BqaDash2/${getAttributeValue(user.Attributes, 'name')}?username=${user.Username}`,
                    {
                      state: {
                        uniName: getAttributeValue(user.Attributes, 'name'),
                      },
                    },
                  )
                }
              >
                <div
                  className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark"
                  style={{ marginBottom: '20px', height: '300px' }} // Set fixed height for each card
                >
                  <div
                    style={{
                      height: '200px',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    {' '}
                    {/* Container for fixed size image */}
                    {user.imageUrl && (
                      <img
                        src={user.imageUrl}
                        style={{
                          maxHeight: '100%',
                          maxWidth: '100%',
                          objectFit: 'contain',
                        }} // Ensure the image fits within the container without being cut off
                        alt="S3 Image"
                      />
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="text-lg font-semibold mb-3">
                      {getAttributeValue(user.Attributes, 'name')}
                    </h3>
                    <div
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium indicator ${statusClass}`}
                    >
                      {user.status}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default BqaDash1;