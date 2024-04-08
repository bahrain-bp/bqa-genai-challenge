import React from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import './PredefinedTemplate.css'; // Importing CSS file

const EvidenceFiles: React.FC = () => {
  return (
    
    <DefaultLayout>
      <h2 style={{ marginBottom: '30px', marginLeft: '10px', marginTop: '50px' }}>Download Files</h2>

      <div className="container">
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4">
          <div className="col">
            <div className="card radius-10 border-start border-0 border-3 border-info custom-card-width">
              <div className="card-body">
                <a href="https://d31g6x2az7a5ww.cloudfront.net/BQA Shared Materials/Evidence Gathering/Evidence-Indicator 10 - infrastructure/SM109 Room Sizeslist of all facilities.xls" className="link-unstyled">
                  <div className="d-flex align-items-center">
                    <div>
                      <p className="mb-0 text-secondary">SM109</p>
                      <h4 className="my-1 text-info">Room Sizeslist of all facilities</h4>
                      <p className="mb-0 font-13" style={{ fontWeight: 'normal' }}>The institution has a clearly stated vision, mission and values that are appropriate for the institutional type <br /> and the programmes offered; and these align with the national priorities of the Kingdom of Bahrain.</p>
                    </div>

                    <div className="widgets-icons-2 rounded-circle bg-gradient-scooter text-white ms-auto">
                      <i className="fa fa-download"></i>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4">
          <div className="col">
            <div className="card radius-10 border-start border-0 border-3 border-success custom-card-width">
              <div className="card-body">
                <a href="https://d31g6x2az7a5ww.cloudfront.net/BQA Shared Materials/Evidence Gathering/Evidence-Indicator 10 - infrastructure/SM109 Room Sizeslist of all facilities.xls" className="link-unstyled">
                  <div className="d-flex align-items-center">
                    <div>
                      <p className="mb-0 text-secondary">SM119</p>
                      <h4 className="my-1 text-info">Health & Safety Orientation for staff and students</h4>
                      <p className="mb-0 font-13" style={{ fontWeight: 'normal' }}>The institution exhibits sound governance and management practices, and financial management that are linked with institutional planning.</p>
                    </div>

                    <div className="widgets-icons-2 rounded-circle bg-gradient-scooter text-white ms-auto">
                      <i className="fa fa-download"></i>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4">
          <div className="col">
            <div className="card radius-10 border-start border-0 border-3 border-warning custom-card-width">
              <div className="card-body">
                <a href="https://d31g6x2az7a5ww.cloudfront.net/BQA Shared Materials/Evidence Gathering/Evidence-Indicator 10 - infrastructure/SM109 Room Sizeslist of all facilities.xls" className="link-unstyled">
                  <div className="d-flex align-items-center">
                    <div>
                      <p className="mb-0 text-secondary">SM120</p>
                      <h4 className="my-1 text-info">Teaching, Learning and Assessment</h4>
                      <p className="mb-0 font-13" style={{ fontWeight: 'normal' }}>Effective teaching facilitates meaningful learning experiences, and assessment provides feedback to enhance teaching and learning</p>
                    </div>

                    <div className="widgets-icons-2 rounded-circle bg-gradient-scooter text-white ms-auto">
                      <i className="fa fa-download"></i>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
     </DefaultLayout>
  );
};

export default EvidenceFiles;