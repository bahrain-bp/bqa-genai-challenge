import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import App from './App.tsx';
import i18n from './pages/i18n.ts'; // Your i18n configuration file
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import { Amplify } from 'aws-amplify';
import { UserProvider } from './UserContext.tsx';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_PraHctOMo',
      userPoolClientId: '27k6s7bn2jtbb8724kgbrord3h',
    },
  },
  API: {
    endpoints: [
      {
        name: 'api',
        endpoint: import.meta.env.VITE_APP_API_URL,
        region: import.meta.env.VITE_APP_REGION,
      },
    ],
  },
} as any);

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <React.StrictMode>
      <UserProvider>
        <Router>
          <App />
        </Router>
      </UserProvider>
    </React.StrictMode>
  </I18nextProvider>,
  document.getElementById('root'),
);
