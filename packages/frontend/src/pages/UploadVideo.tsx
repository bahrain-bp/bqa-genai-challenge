import React from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { FaGem, FaGoogle } from 'react-icons/fa';

const UploadVideo: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName='Upload Video'/>
      <div className="flex flex-col r h-screen">
        <div className="mb-10 flex items-center">
          <FaGem className="text-2xl text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Gemini</h2>
          <span className="mx-2 text-gray-400">+</span>
          <FaGoogle className="text-2xl text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold">Google</h2>
        </div>
        <div className="w-96 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-2 px-4 dark:border-strokedark">
            <h3 className="text-sm font-medium text-black dark:text-white">
              Analyze Videos with AI
            </h3>
          </div>
          <div className="flex flex-col gap-3 p-4">
            <div>
              <label className="text-xs block text-black dark:text-white">
                Attach file
              </label>
              <input
                type="file"
                className="w-full px-3 py-2 border border-stroke rounded-lg bg-transparent outline-none cursor-pointer transition hover:bg-primary hover:bg-opacity-10 focus:border-primary focus:bg-primary focus:bg-opacity-10 active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UploadVideo;
