import UploadSvg from '../../images/Upload.svg';
import ReviewSvg from '../../images/Review.svg';
import dashSVG from '../../images/dash.svg';





export const homeObjOne = {
    id: 'about',
    lightBg: false,
    lightText: true,
    lightTextDesc: true,
    topLine: 'About Us',
    headline: 'Explore EduScribeAI’s Capabilities',
    description: 'Developed in partnership with AWS, EduScribeAI uses cutting-edge GenAI technology to provide real-time insights and automate quality reporting. It ensures consistency, reduces human error, and offers a user-friendly interface for effortless management of compliance documentation. EduScribeAI makes quality assessments efficient and precise, setting new standards in educational quality management.',
    buttonLabel: 'Get started',
    imgStart: false,
    //img: require('../../images/Upload.svg'),
    // img: require('../../images/svg-1.svg').default,
    img: UploadSvg,
    alt: 'Car',
    dark: true,
    primary: true,
    darkText: false
};



export const homeObjtwo = {
    id: 'discover',
    lightBg: false,
    lightText: true,
    lightTextDesc: true,
    topLine: 'Discover',
    headline: 'EduScribeAI in Action',
    description: 'Discover how EduScribeAI, powered by AWS Bedrock and SageMaker models, transforms self-assessment in education with speed and precision. This innovative tool cuts down review times from weeks to hours, allowing institutions to focus on enhancing educational standards more efficiently.',
    buttonLabel: 'Get started',
    imgStart: true,
    //img: require('../../images/Upload.svg'),
    // img: require('../../images/svg-1.svg').default,
    img: dashSVG,
    alt: 'Car',
    dark: true,
    primary: true,
    darkText: false
};



export const homeObjthree = {
    id: 'services',
    lightBg: false,
    lightText: true,
    lightTextDesc: true,
    topLine: 'Premium Bank',
    headline: 'Unlimited Transactions with zero fees',
    description: 'Get access to our exclusive app that allows you to send unlimited transactions without getting charged any fees.',
    buttonLabel: 'Get started',
    imgStart: false,
    //img: require('../../images/Upload.svg'),
    // img: require('../../images/svg-1.svg').default,
    img: ReviewSvg,
    alt: 'Car',
    dark: true,
    primary: true,
    darkText: false
};
