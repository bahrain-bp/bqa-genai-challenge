import React from 'react';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CommentModal: React.FC<CommentModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <button className="mb-4 text-red-500" onClick={onClose}>Close</button>
        {children}
      </div>
    </div>
  );
};

export default CommentModal;