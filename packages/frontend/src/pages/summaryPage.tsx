import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import  { useState, useEffect } from 'react';

// Define a type for the expected file data
// type FileData = {
//   fileName: string;
//   standardName: string;
//   indicatorNumber: number;
//   summary: string;
//   strength: string;
//   weakness: string;
//   score: number;
//   comments: string;
// }
const SummaryPage=() => {
    //standards?standardId=${standardId}
    // const { fileName } = useParams<{ fileName: string }>();
    const [fileData, setFileData] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const apiURL = import.meta.env.VITE_API_URL;

   
        const fetchFiles = async () => {
          // setLoading(true);

          try {
            // const response = await fetch('https://66xzg471hh.execute-api.us-east-1.amazonaws.com/summarization/BusinessPlan.pdf');
            const response = await fetch(`${apiURL}/summarization/BusinessPlan.pdf`);

            const data = await response.json();
            setFileData(data);
           setLoading(false);

            // setStandards(Array.from(standardsMap.values()));
          } catch (error) {
            console.error('Error fetching files:', error);
           // toast.error(Error fetching standards: ${error.message});
          }
        };

        useEffect(() => {
         
            fetchFiles();
        
        }, []);
        // useEffect(() => {
        //   if (fileName) {
        //     fetchFiles();
        //   }
        // }, [fileName]);
    
     

    return (
    <DefaultLayout>
      <Breadcrumb pageName="Summarized Evidence Page" />
      {/**File name  */}
      <div>
      {loading ? (
          <p>Loading...</p>
        ) : fileData ? (
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                       
                        {/* <p><strong>File Name:</strong> {fileData.fileName}</p> */}
                        {/* <p><strong>Standard Name:</strong> {fileData.standardName}</p> */}
                        {/* <p><strong>Indicator Number:</strong> {fileData.indicatorNumber}</p> */}
                        {/* <p><strong>Summary:</strong> {fileData.summary}</p> */}
                       
        

                      <div 
className="mb-5 flex flex-col gap-5 sm:flex-row ml-3 mr-3 px-7 "     >
               <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 mt-4 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        File Name
                      </label>
                      <input 
// className="w-full h-auto min-h-[150px] resize-y rounded border border-stroke bg-gray-100 py-3 pl-4 pr-4 text-black 
// focus:border-primary focus-visible:outline-none dark:border-stroke-dark dark:bg-meta-4 dark:text-white dark:focus:border-primary"        
//                           className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary "
// className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
placeholder= {fileData.fileName}
disabled
>
</input>
</div>       
               
                {/* <h3 className="font-medium text-black dark:text-white">
                 File Name: {fileData.fileName}
                </h3> */}
              {/* </div> */}
              {/* <div className="border-b border-stroke py-4 px-7 dark:border-strokedark"> */}
                {/* <h3 className="font-medium text-black dark:text-white">
                Standard Name :  {fileData.standardName}
                </h3> */}
              {/* </div> */}
              {/* <div className="border-b border-stroke py-4 px-7 dark:border-strokedark"> */}
              <div className="w-full sm:w-1/2">
              <label
                        className="mb-3 mt-4 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Standard Name
                      </label>
                      <input 
// className="w-full h-auto min-h-[150px] resize-y rounded border border-stroke bg-gray-100 py-3 pl-4 pr-4 text-black 
// focus:border-primary focus-visible:outline-none dark:border-stroke-dark dark:bg-meta-4 dark:text-white dark:focus:border-primary"        
//                           className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary "
// className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
placeholder= {fileData.standardName}
disabled
>
</input>


</div>

{/* <div className="border-b border-stroke py-4 px-7 dark:border-strokedark"> */}


</div>

<div 
className="mb-5 flex flex-col gap-5 sm:flex-row ml-3 mr-3 px-7 "     >


<div className="w-full sm:w-1/2">
<label
          className="mb-3 mt-4 block text-sm font-medium text-black dark:text-white"
          htmlFor="fullName"
        >
          Indicator Number
        </label>
        <input 
// className="w-full h-auto min-h-[150px] resize-y rounded border border-stroke bg-gray-100 py-3 pl-4 pr-4 text-black 
// focus:border-primary focus-visible:outline-none dark:border-stroke-dark dark:bg-meta-4 dark:text-white dark:focus:border-primary"        
//                           className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary "
// className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
placeholder= {fileData.indicatorNumber}
disabled
>
</input>
</div>

<div className="w-full sm:w-1/2">
<label
          className="mb-3 mt-4 block text-sm font-medium text-black dark:text-white"
          htmlFor="fullName"
        >
         Total Score
        </label>
        <input 
// className="w-full h-auto min-h-[150px] resize-y rounded border border-stroke bg-gray-100 py-3 pl-4 pr-4 text-black 
// focus:border-primary focus-visible:outline-none dark:border-stroke-dark dark:bg-meta-4 dark:text-white dark:focus:border-primary"        
//                           className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary "
// className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
placeholder= {fileData.score}
disabled
>
</input>
</div>



</div>

<div className=" py-2 px-7">
<label
          className="mb-3 mt-4 block text-sm font-medium text-black dark:text-white"
          htmlFor="fullName"
        >
         Strength
        </label>
        <div 
// className="w-full h-auto min-h-[150px] resize-y rounded border border-stroke bg-gray-100 py-3 pl-4 pr-4 text-black 
// focus:border-primary focus-visible:outline-none dark:border-stroke-dark dark:bg-meta-4 dark:text-white dark:focus:border-primary"        
//                           className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary "
// className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"

>
{fileData.strength}
</div>
</div>



<div className=" py-2 px-7">
<label
          className="mb-3 mt-4 block text-sm font-medium text-black dark:text-white"
          htmlFor="fullName"
        >
         Weaknesses
        </label>
        <div 
// className="w-full h-auto min-h-[150px] resize-y rounded border border-stroke bg-gray-100 py-3 pl-4 pr-4 text-black 
// focus:border-primary focus-visible:outline-none dark:border-stroke-dark dark:bg-meta-4 dark:text-white dark:focus:border-primary"        
//                           className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary "
// className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"

>
{fileData.weakness}
</div>
</div>
<div className=" py-2 px-7">
<label
          className="mb-3 mt-4 block text-sm font-medium text-black dark:text-white"
          htmlFor="fullName"
        >
         Comments
        </label>
        <div 
// className="w-full h-auto min-h-[150px] resize-y rounded border border-stroke bg-gray-100 py-3 pl-4 pr-4 text-black 
// focus:border-primary focus-visible:outline-none dark:border-stroke-dark dark:bg-meta-4 dark:text-white dark:focus:border-primary"        
//                           className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary "
// className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"

>
{fileData.comments}
</div>
</div>




<div className=" py-4 px-7">
<label
          className="mb-3 mt-4 block text-sm font-medium text-black dark:text-white"
          htmlFor="fullName"
        >
          Summary
        </label>
        <div 
// className="w-full h-auto min-h-[150px] resize-y rounded border border-stroke bg-gray-100 py-3 pl-4 pr-4 text-black 
// focus:border-primary focus-visible:outline-none dark:border-stroke-dark dark:bg-meta-4 dark:text-white dark:focus:border-primary"        
//                           className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary "
// className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"

>
{fileData.summary}
</div>







</div>

              {/* <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">

              <div 
// className="w-full h-auto min-h-[150px] resize-y rounded border border-stroke bg-gray-100 py-3 pl-4 pr-4 text-black 
// focus:border-primary focus-visible:outline-none dark:border-stroke-dark dark:bg-meta-4 dark:text-white dark:focus:border-primary"        
className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"              
                     >
                         {fileData.summary} 
                      </div>
                      </div> */}

              
              
            

            
                    </div>
                      ) : (
                        <p>No data found for the file.</p>
                    )}
                </div>
        </DefaultLayout>

    );


};
export default SummaryPage;

