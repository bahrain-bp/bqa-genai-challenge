import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import './BqaDash1.css'; // Custom CSS file for progress bars
import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';





const BqaDash1 = () => {

  const navigate = useNavigate();

  /*const handleUniversitySelect = (email:any) => {
    navigate(`/BqaDash2/${email}`);
  };*/
  const [users, setUsers] = useState<{ Username: string; Attributes: { Name: string; Value: string }[] }[]>([]);
  const { t } = useTranslation(); // Hook to access translation functions
    


 //const [selectedEmail, /*setSelectedEmail*/] = useState<string>('');
  
 // const [subject, /*setSubject*/] = useState<string>('');
  //const [message, /*setMessage*/] = useState<string>('');

  

  useEffect(() => {
    const fetchCognitoUsers = async () => {
      try {
        const response = await fetch('https://u1oaj2omi2.execute-api.us-east-1.amazonaws.com/getUsers');
        const data = await response.json();
        if (response.ok) {
                  // Filter out users where the 'name' attribute is 'BQA reviewer'
        const filteredUsers = data.filter((user: { Attributes: { Name: string; Value: string; }[]; }) => {
          const nameValue = getAttributeValue(user.Attributes, 'name');
          return nameValue !== 'BQA Reviewer';
        });
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
  }, []);
    // Function to find attribute value by name
    const getAttributeValue = (attributes: { Name: string; Value: string }[], attributeName: string): string => {
      const attribute = attributes.find(attr => attr.Name === attributeName);
      return attribute ? attribute.Value : 'N/A'; // Returns 'N/A' if attribute not found
    };
    
  //     const handleSubmit = () => {
  //   // Example of what you might do, customize as needed:
  //   console.log(`Email: ${selectedEmail}, Subject: ${subject}, Message: ${message}`);
  //   // Here you would typically send this data to a backend API
  // };









  return (
    <DefaultLayout>
    <Breadcrumb pageName={t("bqaReviewerDashboard")} />
    <div className="container">
    <div className="flex justify-end py-4">

{/* Add university */}
        <button   
            className="px-5 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-opacity-50"
        > 
              <Link to={`/AddUni`}>
              {t('addUniversity')}
              </Link>
      </button>
      </div>
      <div className="row">
        {users.map(user => (
          <div key={user.Username} className="col-md-4 col-sm-6" style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/BqaDash2/${getAttributeValue(user.Attributes, 'email')}`)}>
            <div className="rounded-xl border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark" style={{ marginBottom: '20px' }}>
              <div className="d-flex justify-content-between align-items-center">
                <h3 style={{ marginBottom: '10px' }}>{getAttributeValue(user.Attributes, 'name')}</h3>
                <div className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium indicator bg-success text-success">  {t('completed')}</div>
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
