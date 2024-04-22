import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import './BqaDash1.css'; // Custom CSS file for progress bars

const BqaDash1 = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Bqa Reviewer Dashboard" />

      <div className="container">
        <div className="row">
          <a href="BqaDash2" className="col-md-1 col-sm-6">
            <div
              className="rounded-xl border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark"
              style={{ marginBottom: '20px' }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h3 style={{ marginBottom: '10px' }}>University Of Bahrain</h3>
                <div className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium indicator bg-success text-success">Completed</div>
              </div>
              {/* 
                      <div className="progress blue">
                        <span className="progress-left">
                          <span className="progress-bar"></span>
                        </span>
                        <span className="progress-right">
                          <span className="progress-bar"></span>
                        </span>
                        <div className="progress-value">90%</div>
                      </div>
                  */}
            </div>
          </a>

          <div className="col-md-1 col-sm-1">
            <div
              className="rounded-xl border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark"
              style={{ marginBottom: '20px' }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h3 style={{ marginBottom: '10px' }}>Bahrain Polytechnic</h3>
                <div className=" inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium indicator bg-danger text-warning">In Progress</div>
              </div>
              {/* Conditional indicator rendering */}
              {/* End of conditional rendering */}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default BqaDash1;
