import React from 'react';

const ForbiddenPage = () => {
  const goBack = () => {
    window.history.back();
  };

  return (
    <div
      className="bg-dark text-white vh-100 d-flex flex-column justify-content-center align-items-center"
      style={{ backgroundColor: 'black', color: 'white' }}
    >
      <div className="container text-center">
        <div className="row">
          <div className="col-md-12">
            <p>
              <i className="fa fa-exclamation-triangle fa-5x"></i>
              <br />
              Status Code: 403
            </p>
            <h1 className="mb-4">OPPSSS!!!! Sorry...</h1>
            <p>
              Sorry, your access is refused due to security reasons of our
              server and also our sensitive data.
              <br />
              Please go back to the previous page to continue browsing.
            </p>
            <button className="btn btn-danger mt-3" onClick={goBack}>
              Go Back
            </button>
          </div>
        </div>
      </div>
      <footer className="text-center mt-auto py-3">
        Hak Cipta 2018, Garuda Cyber Technologies
      </footer>
    </div>
  );
};

export default ForbiddenPage;
