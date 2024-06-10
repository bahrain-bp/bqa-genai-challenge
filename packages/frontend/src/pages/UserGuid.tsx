import React, { useState, useEffect } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import Loader from '../common/Loader';
import './UGuid.css';
import video1 from '../videos/upload.mp4';
import video2 from '../videos/assesment.mp4';
import video3 from '../videos/summary.mp4';
import video4 from '../videos/login.mp4';
import video5 from '../videos/predefined.mp4';
import video6 from '../videos/OfficerDash.mp4';
import video7 from '../videos/predefinedBQA-ezgif.com-video-speed.mp4';
import video8 from '../videos/bqadash-ezgif.com-video-speed.mp4';
import video9 from '../videos/commentandadditionaldoc-ezgif.com-video-speed.mp4';
import video10 from '../videos/summarybqa.mp4';
import video11 from '../videos/assesmentbqa.mp4';
import pic1 from '../images/aws.jpg';
import { fetchUserAttributes } from 'aws-amplify/auth';
import axios from 'axios';
import UserOne from '../images/user/BQA.jpg';


const UserGuid: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [currentLogo, setCurrentLogo] = useState('');
  const [imagesFetched, setImagesFetched] = useState<boolean>(false); // Flag to track if images are fetched
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentName, setCurrentName] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;


  useEffect(() => {
    if (!imagesFetched && currentName) {
        const fetchImage = async () => {
            const fileKey = `${currentName}/logos/${currentName}.png`;
            try {
                const response = await axios.get(`${apiUrl}/viewFile?data={"fileKey":"${fileKey}"}`, {
                    responseType: 'arraybuffer',
                });
                if (response.status === 200 && response.headers['content-type'].startsWith('image/')) {
                    const imageData = btoa(
                        new Uint8Array(response.data).reduce(
                            (data, byte) => data + String.fromCharCode(byte),
                            '',
                        ),
                    );
                    setCurrentLogo(`data:${response.headers['content-type']};base64,${imageData}`);
                } else {
                    throw new Error('Failed to fetch image');
                }
            } catch (error) {
                console.error('Error fetching images:', error);
                setCurrentLogo(UserOne); // Set to default image on error
            }
            setImagesFetched(true);
        };

        fetchImage();
    }
}, [currentName, imagesFetched, apiUrl]);


    useEffect(() => {
        setLoading(true);
        const fetchCurrentUserInfo = async () => {
            try {
                const attributes = await fetchUserAttributes();
                const name: any = attributes.name;
                setIsAdmin(name.endsWith("BQA Reviewer"));
            } catch (error) {
                console.error('Error fetching current user info:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUserInfo();
    }, []);

    const adminContent = [
        { title: "Login", description: "Securely log in to access the administrative dashboard and manage system settings.", video: video4, image: pic1 },
        { title: "Predefined Templates", description: "Review and manage the templates and requirements for each standard and indicator. Add new templates as needed to accommodate evolving criteria.", video: video7, image: pic1 },
        { title: "View the Dashboard", description: "Access real-time analytics and progress updates for each university to monitor compliance and document uploads effectively.", video: video8, image: pic1 },
        { title: "Review the Generated Assessment", description: "Examine detailed assessments for each standard and indicator to ensure all requirements are met and identify areas needing attention.", video: video11, image: pic1 },
        { title: "View Their Summary", description: "Inspect summary reports for each submitted file to assess completeness and accuracy of the evidence provided.", video: video10, image: pic1 },
        { title: "Comment and Request Additional Documents", description: "Provide feedback on submissions and request additional documents to ensure thorough evaluation and compliance with established standards.", video: video9, image: pic1 },
    ];

    const userContent = [
        { title: "Login", description: "Log in to your account to start uploading and managing your documentation securely.", video: video4, image: pic1 },
        { title: "Predefined Templates", description: "Explore the available templates to understand the requirements for each standard and indicator, ensuring your submissions meet all criteria.", video: video5, image: pic1 },
        { title: "Upload Documents", description: "Securely upload your documents, including PDFs, videos, and images, ensuring they are stored safely and accessible for review.", video: video1, image: pic1 },
        { title: "View the public Dashboard", description: "Navigate through the dashboard to view and manage your uploaded documents, delete files, or review them in detail.", video: video6, image: pic1 },
        { title: "View Their Summary", description: "Review detailed summaries for each of your submissions directly through the dashboard, providing insights into your compliance status.", video: video3, image: pic1 },
        { title: "Review the Generated Assessment", description: "Access and review the generated assessments for each standard and indicator to understand how your submissions are evaluated against the criteria.", video: video2, image: pic1 }
    ];

    if (loading) {
        return <Loader />;
    }

    return (
        <DefaultLayout>
                <h1 className="text-xl font-bold">User Guide</h1>
                <p>Welcome to the user guide page. Here, you can find information on how to use the application.</p>
            <div className="timeline">
                {(isAdmin ? adminContent : userContent).map((item, index) => (
                    <div className={`container ${index % 2 === 0 ? 'left-container' : 'right-container'}`} key={index}>
                        <img src={currentLogo}  />
                        <div className="text-box">
                            <h2>{item.title}</h2>
                            <video autoPlay loop muted className="video-style">
                                <source src={item.video} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <small>View the guide</small>
                            <p>{item.description}</p>
                            <span className={`container-arrow ${index % 2 === 0 ? 'left-container-arrow' : 'right-container-arrow'}`}></span>
                        </div>
                    </div>
                ))}
            </div>
        </DefaultLayout>
    );
};

export default UserGuid;
