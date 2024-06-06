import React from 'react';
import { useEffect ,useState} from 'react';
import axios from 'axios';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  fileKey:any;
}


const CommentModal: React.FC<CommentModalProps> = ({ isOpen, onClose, children,fileKey }) => {
  if (!isOpen) return null;
  const [loading, /*setLoading*/] = useState(false);

  const [comments, setComments] = useState<any | null>(null);
  const apiURL: string = import.meta.env.VITE_API_URL;
    // Define custom shadow style directly in the component
    const shadowStyle = {
      boxShadow: ' 2px 2px 4px rgba(0, 0, 0, 0.001),-2px -2px 10px rgba(0, 0, 0, 0.001),2px -2px 20px rgba(0, 0, 0, 0.01),-2px 2px 20px rgba(0, 0, 0, 0.1)'
    };
 
 


 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Lighter background similar to the 'Confirm Deletion' modal */}
      <div className="fixed inset-0 bg-white bg-opacity-45"></div>  {/* Adjust opacity as needed */}
      <div className="relative bg-white p-3 rounded shadow-2xl" style={shadowStyle}> {/* Modal content */}
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
        <div className="mt-8">
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