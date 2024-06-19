import  { useEffect, useState } from 'react';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import BqaDash1 from '../pages/BqaDash1';
import OfficerDash from '../pages/OfficerDash';
import Loader from '../common/Loader';

const Dashboard = () => {
  const [ user,setUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // Use null to signify undetermined state
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCurrentUserInfo = async () => {
      try {
        const currentUser = await getCurrentUser();
        const userId = currentUser?.userId;
        const attributes = await fetchUserAttributes();

        return {
          userId,
          username: currentUser?.username,
          attributes,
        };
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        return null;
      }
    };

    const getUser = async () => {
      const userInfo = await getCurrentUserInfo();
      if (userInfo) {
        setUser(userInfo);
        setIsAdmin(userInfo.attributes.name?.startsWith('BQA') || false);
      }

      setLoading(false);
    };

    getUser();
  }, []);

  useEffect(() => {
`    // if (isAdmin) {
    //     console.log(isAdmin);
    //   console.log('This is BQA Reviewer');
    // } else {
    //     console.log(isAdmin);

    //   console.log('Other type of user');
    // }`
  }, [isAdmin,user]);

  if (loading || isAdmin === null) {
    return <Loader />; // Render loading indicator while fetching user info or isAdmin is not determined
  }

  return (
    <>
      {isAdmin ? <BqaDash1 /> : <OfficerDash />}
    </>
  );
};

export default Dashboard;
