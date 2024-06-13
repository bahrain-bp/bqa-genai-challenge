import React from 'react';
// import { /*useEffect*/ useState} from 'react';
// import axios from 'axios';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  fileKey:any;
}


const CommentModal: React.FC<CommentModalProps> = ({ isOpen, onClose, children,fileKey }) => {
  if (!isOpen) return null;
  console.log("filekey",fileKey);
 
 
 

  return (
<div className="fixed inset-0 z-10 flex items-center justify-center" style={{ marginLeft: '100px' }}>
{/* Lighter background similar to the 'Confirm Deletion' modal */}
{}
<div className="fixed bg-white bg-opacity-100 inset-0"></div>  
<div className="relative bg-white p-8 rounded shadow-2xl" style={{ width: '50vw', maxWidth: '600px', minHeight: '300px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      {/* Close button at the top-right */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-red-500 p-2 hover:outline-black  rounded-full"
          style={{ marginTop: '10px', marginRight: '10px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L12 10.586l6.293-6.293a1 1 0 111.414 1.414L13.414 12l6.293 6.293a1 1 0 01-1.414 1.414L12 13.414l-6.293 6.293a1 1 0 01-1.414-1.414L10.586 12 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <div className=" text-lg">
        {children}
  {/* {loading ? (
    <p>Loading...</p>
  ) : comments ? (
    <>
      <div>{comments.comments}</div>
    </>
  ) : null} */}
</div>
      </div>
    </div>
  );
};

export default CommentModal;