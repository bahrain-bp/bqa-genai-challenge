import React from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import CardDataStats from '../components/CardDataStats';
import './PredefinedTemplate.css'; // Importing CSS file

const PredefinedTemplate: React.FC = () => {
  return (
    <DefaultLayout>
      <h2 className="predefined-title">Predefined Templates</h2>
      <h6 className="predefined-subtitle">In hear you can find predefined templates, that should help guide you to the required documents</h6>
      <div className="container">
        <div className="row">
          <div className="col-md-4 col-xl-3">
            <div className="scard bg-c-blue order-scard">
              <div className="scard-block">
                <h6 className="m-b-20">Standard 1: </h6>
                <p className="m-b-0">Governance and Management</p>
                <h2 className="text-right"><i className="fas fa-chart-line f-left"></i><span>5</span></h2>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-xl-3">
            <div className="scard bg-c-green order-scard">
              <div className="scard-block">
                <h6 className="m-b-20">Standard 2: </h6>
                <p className="m-b-0">Human Resources Management</p>
                <h2 className="text-right"><i className="fas fa-chart-line f-left"></i><span>2</span></h2>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-xl-3">
            <div className="scard bg-c-yellow order-scard">
              <div className="scard-block">
                <h6 className="m-b-20">Standard 3: </h6>
                <p className="m-b-0">Quality Assurance and Enhancement</p>
                <h2 className="text-right"><i className="fas fa-chart-line f-left"></i><span>2</span></h2>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-xl-3">
            <div className="scard bg-c-blue order-scard">
              <div className="scard-block">
                <a href="evidenceFiles.html" className="link-unstyled">
                  <h6 className="m-b-10">Standard 4: </h6>
                  <p className="m-b-0" style={{ fontWeight: 'normal' }}>Infrastructure, ICT & Learning Resources</p>
                  <h2 className="text-right"><i className="fas fa-chart-line f-left"></i><span>3</span></h2>
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-xl-3">
            <div className="scard bg-c-pink order-scard">
              <div className="scard-block">
                <h6 className="m-b-20">Standard 5: </h6>
                <p className="m-b-0">Management of Academic Affairs</p>
                <h2 className="text-right"><i className="fas fa-chart-line f-left"></i><span>4</span></h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default PredefinedTemplate;