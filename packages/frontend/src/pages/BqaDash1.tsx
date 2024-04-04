//import React from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import './BqaDash1.css'; // Custom CSS file for progress bars

const BqaDash1 = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Bqa Reviewer Dashboard" />

      <div className="container">
        <div className="row">
          <div className="col-md-1 col-sm-6">
            <div className="rounded-xl border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark" style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '10px' }}>University Of Bahrain</h3>
              <div className="progress blue">
                <span className="progress-left">
                  <span className="progress-bar"></span>
                </span>
                <span className="progress-right">
                  <span className="progress-bar"></span>
                </span>
                <div className="progress-value">90%</div>
              </div>
            </div>
          </div>
          <div className="col-md-1 col-sm-1">
            <div className="rounded-xl border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark" style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '10px' }}>Bahrain Polytechnic</h3>
              <div className="progress yellow">
                <span className="progress-left">
                  <span className="progress-bar"></span>
                </span>
                <span className="progress-right">
                  <span className="progress-bar"></span>
                </span>
                <div className="progress-value">75%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default BqaDash1;
