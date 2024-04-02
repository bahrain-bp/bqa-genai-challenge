import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
//import CoverOne from '../images/cover/cover-01.png';
//import userSix from '../images/user/user-06.png';
//import { Link } from 'react-router-dom';
//import CardDataStats from '../components/CardDataStats';
//import userThree from '../images/user/user-03.png'; // Import the userThree image
//import React from 'react'; // Import React

//import '../../index.css';
import 'bootstrap-icons/font/bootstrap-icons.json';
import 'react-toastify/dist/ReactToastify.css';

 import CIcon from '@coreui/icons-react'
import {cilCheckAlt} from '@coreui/icons'









const UploadEvidence = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Upload Evidence" />

      
      <div className="mb-4">
  <div className="flex flex-col items-center justify-between mt-2">
    <div className="flex items-center">
      <div className="flex items-center justify-center sm:ml-10 sm:w-5 sm:max-w-xs sm:h-5 md:w-6 md:h-6 xl:h-8 xl:w-8 rounded-full bg-green-500">
        <CIcon className="text-white" icon={cilCheckAlt} />
      </div>
      <div className="sm:w-[30px] lg:w-[80px] h-2 bg-green-500"></div> {/* Step 1 to Step 2 line */}
      <div className="flex items-center justify-center sm:w-5 sm:max-w-xs sm:h-5 md:w-6 md:h-6 xl:w-8 xl:h-8 rounded-full bg-stone-200"></div>
      <div className="sm:w-[30px] lg:w-[80px] h-2 bg-green-500"></div> {/* Step 2 to Step 3 line */}
      <div className="flex items-center justify-center sm:w-5 sm:max-w-xs sm:h-5 md:w-6 md:h-6 xl:w-8 xl:h-8 rounded-full bg-stone-200"></div>
      <div className="sm:w-[30px] lg:w-[80px] h-2 bg-green-500"></div> {/* Step 2 to Step 3 line */}
      <div className="flex items-center justify-center sm:w-5 sm:max-w-xs sm:h-5 md:w-6 md:h-6 xl:w-8 xl:h-8 rounded-full bg-stone-200"></div>
      <div className="sm:w-[30px] lg:w-[80px] h-2 bg-green-500"></div> {/* Step 2 to Step 3 line */}
      <div className="flex items-center justify-center sm:w-5 sm:max-w-xs sm:h-5 md:w-6 md:h-6 xl:w-8 xl:h-8 rounded-full bg-stone-200"></div>
      <div className="sm:w-[30px] lg:w-[80px] h-2 bg-green-500"></div> {/* Step 1 to Step 2 line */}
      <div className="flex items-center justify-center sm:w-5 sm:max-w-xs sm:h-5 md:w-6 md:h-6 xl:w-8 xl:h-8 rounded-full bg-stone-200"></div>
      <div className="sm:w-[30px] lg:w-[80px] h-2 bg-green-500"></div> {/* Step 1 to Step 2 line */}
      <div className="flex items-center justify-center sm:w-5 sm:max-w-xs sm:h-5 md:w-6 md:h-6 xl:w-8 xl:h-8 rounded-full bg-stone-200"></div>
      <div className="sm:w-[30px] lg:w-[80px] h-2 bg-green-500"></div> {/* Step 1 to Step 2 line */}
      <div className="flex items-center justify-center sm:w-5 sm:max-w-xs sm:h-5 md:w-6 md:h-6 xl:w-8 xl:h-8 rounded-full bg-stone-200"></div>
      <div className="sm:w-[30px] lg:w-[80px] h-2 bg-green-500"></div> {/* Step 1 to Step 2 line */}
      <div className="flex items-center justify-center sm:w-5 sm:max-w-xs sm:h-5 md:w-6 md:h-6 xl:w-8 xl:h-8 rounded-full bg-stone-200"></div>
    </div>
    {/* sm: Small screens (default: ≥640px)
    md: Medium screens (default: ≥768px)
    lg: Large screens (default: ≥1024px)
    xl: Extra-large screens (default: ≥1280px)
    2xl: 2X extra-large screens (default: ≥1536px) */}
    <div className="text-sm text-gray-500 mt-3"></div>
  </div>
</div>








      <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  <b>Standard 1: Governance and Management</b></h3>
              </div>
              <div className="p-5">
              <h3 className="font-medium text-black dark:text-white">
                    Indicator 1: Vision Mission and Values  </h3>
                   
                  </div>
<div className="p-4">
                  <div
                  
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5 "
                  >
                    
                    <input
                      type="file"
                      accept="*"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                            fill="#3C50E0"
                          />
                        </svg>
                      </span>
                      <p>
                        <span className="text-primary">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                      <p>(max, 800 X 800px)</p>
                    </div>
                  </div>
                  </div>

                  <div className="flex justify-end gap- mb-5">
                    <button
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white mr-4"
                      type="submit"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90 mr-4"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
              </div>
            </div>
            
    </DefaultLayout>
  );
};

export default UploadEvidence;