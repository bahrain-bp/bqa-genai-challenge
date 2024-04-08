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
import PredefinedTemplate from './pages/PredefinedTemplate';

import EvidenceFiles from './pages/EvidenceFiles';

import UploadEvidence from './pages/UploadEvidence';
import OfficerDash from './pages/OfficerDash';
import BqaDash1 from './pages/BqaDash1';
import BqaDash2 from './pages/BqaDash2';

import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { ToastContainer } from 'react-toastify';


function App() {
  const [user, setUser] = useState<any | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  // Get the current logged in user info this is not working
  const getUser = async () => {
    const user = await getCurrentUserInfo();
    if (user) setUser(user);
    setLoading(false);
  };

  const getCurrentUserInfo = async () => {
    const { username, userId: id } = await getCurrentUser();

    const attributes = fetchUserAttributes();
    console.log((await attributes).email);
    return {
      id,
      username,
      attributes,
    };
  };

 

  // Check if there's any user on mount
  useEffect(() => {
    getUser();
  }, []);

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
      <Routes>
        {/* Route to SignInPage */}
        <Route path="/" element={<Navigate to="/Auth/SignInPage" />} />
        <Route
          path="/Auth/SignInPage"
          element={<SignInPage setUser={setUser} user={user} />}
        />

        <Route
          path="/Dashboard"
          element={
            <>
              <PageTitle title="eCommerce Dashboard | EduScribe" />
              <OfficerDash />
            </>
          }
        />

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
          path="/PredefinedTemplate"
          element={
            <>
              <PageTitle title="Predefined Template | EduScribe" />
              <PredefinedTemplate />
            </>
          }
        />
        <Route

          path="/EvidenceFiles"
          element={
            <>
              <PageTitle title="Evidence Files | EduScribe" />
              <EvidenceFiles />
            </>
          }
        />

          path="/UploadEvidence"
          element={
            <>
              <PageTitle title="Upload Evidence | EduScribe" />
              <UploadEvidence />
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
          path="/BqaDash2"
          element={
            <>
              <PageTitle title="Bqa Reviewer Dashboard (University Details)| EduScribe" />
              <BqaDash2 />
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
      </Routes>
    </>
  );
}

export default App;
