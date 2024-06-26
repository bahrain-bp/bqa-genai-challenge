import React from 'react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onYes: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onYes,
}) => {
  if (!isOpen) return null;

  const handleYes = () => {
    onYes();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className="bg-white rounded-lg shadow-lg dark:bg-gray-800 ml-70 ">
        <div className="p-8 items-center justify-center ">
          <div className="ml-80 items-center justify-center ">
            <svg
              className="w-14 h-12 mb-8"
              height="50"
              width="50"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M29.956 29.83a.883.883 0 01-.881.882.883.883 0 01-.882-.882c0-.485.396-.881.882-.881.485 0 .88.396.88.88zm2.882-17.935a.883.883 0 11.001-1.765.883.883 0 01-.001 1.765zm-3.42 8.796a.883.883 0 01-1.763 0c0-.486.396-.882.882-.882s.882.396.882.882zm4.688 15.59a.883.883 0 011.764 0 .883.883 0 01-1.764 0zm4.424-4.978a.997.997 0 00-.51.87v6.192l-7.14 4.222V37.55h1.534a2.875 2.875 0 002.574 1.612 2.885 2.885 0 002.882-2.881 2.885 2.885 0 00-2.882-2.882 2.88 2.88 0 00-2.776 2.15H29.88a1 1 0 00-1 1v7.219l-.405.24-3.508-2.033v-25.93h2.838v1.869a2.879 2.879 0 00-2.151 2.776 2.885 2.885 0 002.882 2.88 2.885 2.885 0 002.882-2.88 2.875 2.875 0 00-1.613-2.574v-2.071h3.3a1 1 0 001-1v-1.458a2.875 2.875 0 001.614-2.574 2.885 2.885 0 00-2.882-2.882 2.885 2.885 0 00-2.882 2.882c0 1.335.917 2.45 2.15 2.776v.256h-7.138V6.804l4.398-2.634 9.192 5.604v6.164a1 1 0 00.507.87l4.869 2.76v3.079H34.72a1 1 0 00-1 1v4.914h-2.071a2.874 2.874 0 00-2.574-1.612 2.885 2.885 0 00-2.882 2.88 2.885 2.885 0 002.882 2.883 2.88 2.88 0 002.776-2.151h2.869a1 1 0 001-1v-4.914h8.215v3.613l-5.405 3.043zM17.247 28.41c.486 0 .882.396.882.882a.883.883 0 01-.882.882.883.883 0 01-.882-.882c0-.486.396-.882.882-.882zm-1.42-15.784a.883.883 0 11.882.882.883.883 0 01-.881-.882zm-3.612 8.064a.883.883 0 01-1.763 0c0-.486.396-.882.88-.882.487 0 .883.396.883.882zm5.225 17.203a.883.883 0 111.765.003.883.883 0 01-1.765-.003zm1.472 6.109l-9.536-5.64v-6.19a1 1 0 00-.517-.876L8.5 31.1h2.639v7.063a1 1 0 001 1h3.608a2.875 2.875 0 002.574 1.613 2.885 2.885 0 002.882-2.882 2.885 2.885 0 00-2.882-2.881 2.88 2.88 0 00-2.776 2.15H13.14V30.1a1 1 0 00-1-1H4.864L4 28.625 4 19.568l4.869-2.761a1 1 0 00.507-.871v-2.58h1.226v4.559a2.879 2.879 0 00-2.15 2.776 2.884 2.884 0 002.88 2.88 2.885 2.885 0 002.883-2.88 2.876 2.876 0 00-1.613-2.574v-4.76h1.332a2.878 2.878 0 002.776 2.152 2.885 2.885 0 002.88-2.882 2.885 2.885 0 00-2.88-2.882 2.875 2.875 0 00-2.574 1.612h-4.76V9.772l9.192-5.603 4.4 2.634v11.544h-5.99a1 1 0 00-1 1v7.372a2.874 2.874 0 00-1.613 2.574 2.885 2.885 0 002.882 2.882 2.885 2.885 0 002.882-2.882c0-1.335-.917-2.45-2.151-2.776v-6.17h4.99V41.59l-4.056 2.413zm27.022-25.016c0-.36-.194-.692-.507-.87l-4.868-2.761-.001-6.143a1 1 0 00-.48-.854L29.892 2.148a1.002 1.002 0 00-1.035-.005L23.969 5.07l-4.892-2.927a.996.996 0 00-1.034.004L7.856 8.357a1.002 1.002 0 00-.48.854v6.143l-4.87 2.762a1 1 0 00-.506.87v10.23a1 1 0 00.518.876l4.859 2.672-.001 6.17c0 .353.186.68.49.86l10.539 6.232a.997.997 0 001.02-.001l4.215-2.507 4.339 2.514a1 1 0 001.01-.005l10.54-6.231a.998.998 0 00.49-.861v-6.176l5.406-3.043a1 1 0 00.51-.871l-.001-9.858z"
                fill="#067F68"
                fill-rule="evenodd"
              ></path>
            </svg>
          </div>
          <p className="text-lg text-gray-800 dark:text-gray-200">
            There are no generated comments for this Indicator. Do you want AI
            to generate comments?
          </p>
          <div className="mt-4 flex justify-end space-x-4 items-center justify-center mr-10 ">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              No
            </button>
            <button
              onClick={handleYes}
              className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-regular rounded-lg text-sm px-5 py-3"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
