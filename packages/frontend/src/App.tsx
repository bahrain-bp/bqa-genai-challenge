import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignInPage from './pages/Auth/SigninPage';

import { Navigate } from 'react-router-dom';

//import SignUp from './pages/Authentication/SignUp';
import Chart from './pages/Chart';
//import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import Standards from './pages/Standards';
import PredefinedTemplate from './pages/PredefinedTemplate';
import EvidenceFiles from './pages/EvidenceFiles';
import Archived from './pages/Archived';
import UploadEvidence from './pages/UploadEvidence';
import OfficerDash from './pages/OfficerDash';
import BqaDash1 from './pages/BqaDash1';
import BqaDash2 from './pages/BqaDash2';
import AddUni from './pages/AddUni';
import ChangePassword from './pages/Auth/ChangePassword';
import ForgotPassword from './pages/Auth/ForgotPassword';
import BqaRequestPage from './pages/BqaRequestPage';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { ToastContainer } from 'react-toastify';
import SummaryPage from './pages/summaryPage';
import RubricPage from './pages/RubricPage';

function App() {
  const [user, setUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  // Check if there's any user on mount
  useEffect(() => {
    const getCurrentUserInfo = async () => {
      try {
        //Auth.currentAuthenticatedUser();  this is old version
        const { username, userId: id } = await getCurrentUser();

        const attributes = fetchUserAttributes();
        console.log((await attributes).email);
        //console.log((await attributes).name);
        const names = (await fetchUserAttributes()).name;
        //  console.log(names);
        return {
          id,
          username,
          attributes,
          names,
        };
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    // Get the current logged in user info
    const getUser = async () => {
      const userInfo = await getCurrentUserInfo();
      if (userInfo) {
        setUser(userInfo);
        setIsAdmin(userInfo.names?.startsWith('BQA') || false);
      }
      setLoading(false);
    };

    getUser();
    if (isAdmin) {
      console.log('This is BQA Reviewer ');
    } else {
      console.log('UNIIIII ');
    }
  }, []);

  ///

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <ToastContainer position="top-right" />
      {/* Route Available to all */}

      <Routes>
        {/* Route to SignInPage */}
        <Route path="/" element={<Navigate to="/Auth/SignInPage" />} />
        <Route
          path="/Auth/SignInPage"
          element={<SignInPage setUser={setUser} user={user} />}
        />
        <Route
          path="/ChangePassword"
          element={
            <>
              <PageTitle title="Change Password | EduScribe" />
              <ChangePassword />
            </>
          }
        />
        <Route
          path="/SummaryPage"
          element={
            <>
              <PageTitle title="Bqa Reviewer Add University | EduScribe" />
              <SummaryPage />
            </>
          }
        />

        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements | EduScribe" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout | EduScribe" />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables | EduScribe" />
              <Tables />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | EduScribe" />
              <Settings />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | EduScribe" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | EduScribe" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | EduScribe" />
              <Buttons />
            </>
          }
        />

        <Route
          path="/ForgotPassword"
          element={
            <>
              <PageTitle title="Reset your password | EduScribe" />
              <ForgotPassword />
            </>
          }
        />
        <Route
          path="/PredefinedTemplate/:standardName"
          element={
            <>
              <PageTitle title="Predefined Template | EduScribe" />
              <PredefinedTemplate />
            </>
          }
        />

        <Route
          path="EvidenceFiles/:indicatorName"
          element={
            <>
              <PageTitle title="Evidence Files | EduScribe" />
              <EvidenceFiles />
            </>
          }
        />

        <Route
          path="/Standards"
          element={
            <>
              <PageTitle title="Standards | EduScribe" />
              <Standards />
            </>
          }
        />

        {/*===================================================================================================================================*/}
        {/* Route Available to BQA Reviewer Only */}

        {isAdmin && (
          <>
            <Route
              path="/Archived"
              element={
                <>
                  <PageTitle title="Archived | EduScribe" />
                  <Archived />
                </>
              }
            />

            <Route
              path="/BqaDash1"
              element={
                <>
                  <PageTitle title="Bqa Reviewer Dashboard | EduScribe" />
                  <BqaDash1 />
                </>
              }
            />

            <Route
              path="/AddUni"
              element={
                <>
                  <PageTitle title="Bqa Reviewer Add University | EduScribe" />
                  <AddUni />
                </>
              }
            />

            <Route
              path="/BqaRequestPage"
              element={
                <>
                  <PageTitle title="Bqa Reviewer Request Additional Documents Page | EduScribe" />
                  <BqaRequestPage />
                </>
              }
            />

            <Route
              path="/BqaDash2/:name"
              element={
                <>
                  <PageTitle title="Bqa Reviewer Dashboard (University Details)| EduScribe" />
                  <BqaDash2 />
                </>
              }
            />
          </>
        )}
        {/**-------------------------------------------------------------------------------------------------------------------- */}
        {/* Route Available to University Officer Only */}
        {!isAdmin && (
          <>
            {/* <Route
          path="/Dashboard"
          element={
            <>
              <PageTitle title="eCommerce Dashboard | EduScribe" />
              <OfficerDash />
            </>
          }
        />  */}

            <Route
              path="/OfficerDash"
              element={
                <>
                  <PageTitle title="Officer Dashboard | EduScribe" />
                  <OfficerDash />
                </>
              }
            />
            <Route
              path="/UploadEvidence"
              element={
                <>
                  <PageTitle title="Upload Evidence | EduScribe" />
                  <UploadEvidence />
                </>
              }
            />
          </>
        )}
        <Route
          path="RubricPage"
          element={
            <>
              <PageTitle title="Rubric Page | EduScribe" />
              <RubricPage />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
