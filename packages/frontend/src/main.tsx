import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.tsx';
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import { Amplify } from "aws-amplify";
 import 'primereact/resources/themes/saga-blue/theme.css';  //theme
 import 'primereact/resources/primereact.min.css';          //core css
 import 'primeicons/primeicons.css';                         //icons



Amplify.configure({
  Auth: {
    //check if there is update on the Auth
    Cognito:{
    userPoolId: "us-east-1_PraHctOMo",
    userPoolClientId: "27k6s7bn2jtbb8724kgbrord3h"
 }
  },
 API: {
    endpoints: [
      {
        name: "api",
        endpoint: import.meta.env.VITE_APP_API_URL,
        region: import.meta.env.VITE_APP_REGION,
      },
    ],
  },

} as any);


 
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
);