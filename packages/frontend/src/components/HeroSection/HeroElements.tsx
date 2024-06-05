import styled from "styled-components";
import {MdKeyboardArrowRight, MdArrowForward} from 'react-icons/md';
//import { Link as LinkS} from "react-scroll";
import { Link } from 'react-router-dom';



export const HeroContainer =styled.div`
    background: #0c0c0c;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 30px;
    height: 800px;
    position: relative;
    z-index: 1;


    :before{
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%), 
        linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 100%);
        z-index:2;
    }
`;

export const HeroBg =styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

export const VideoBg = styled.video`
    width: 100%;
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
    background: #232a34;
    z-index:999;

`;

export const HeroContent =styled.div`
    z-index: 3;
    max-width: 1200px;
    position: absolute;
    padding: 8px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

// export const HeroH1 = styled.h1`
//     color: #fff;  // White color for clarity
//     font-size: 48px;  // Large size for heading
//     text-align: center;
//     text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.6); // Shadow for text to stand out
//     margin-bottom: 20px;  // Space between the heading and paragraph
//     margin-top: 140px;
//     margin-left:30px;
//     @media screen and (max-width: 768px){
//         font-size: 40px;  // Slightly smaller on tablets
//     }

//     @media screen and (max-width: 480px){
//         font-size: 32px;  // Even smaller on phones
//     }
// `;

// export const HeroP = styled.p`
//     margin-top: 0px;  // Reduced space from heading
//     color: #fff;  // White for clarity
//     font-size: 24px;  // Adequate size for readability
//     text-align: center;
//     margin-left:30px;

//     max-width: 600px;  // Max width for better control of text line length
//     text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5); // Shadow for visibility
//     line-height: 1.6;  // Increased line height for better readability

//     @media screen and (max-width: 768px){
//         font-size: 22px;  // Slightly smaller on tablets
//     }

//     @media screen and (max-width: 480px){
//         font-size: 18px;  // Appropriate size for mobile devices
//     }
// `;

export const HeroH1 = styled.h1`
    color: #fff;
    font-size: 48px;
    text-align: center;
    margin-top: -180px;

    @media screen and (max-width: 768px){
        font-size: 40px;
    }

    @media screen and (max-width: 480px){
        font-size: 32px;
    }
`;

export const HeroP = styled.p`
    margin-top: 24px;
    color: #fff;
    font-size: 24px;
    text-align: center;
    max-width: 600Px;

    @media screen and (max-width: 768px){
        font-size: 24px;
    }

    @media screen and (max-width: 480px){
        font-size: 18px;
    }
`;



export const HeroBtnWrapper = styled.div`
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const ArrowForward = styled(MdArrowForward)`
    margin-left: 8px;
    font-size: 20px;
`


export const ArrowRight = styled(MdKeyboardArrowRight)`
    margin-left: 8px;
    font-size: 20px;
`

interface ButtonProps {
    primary?: string;
    dark?: string;
    big?:string;
    fontBig?:string;
  }

export const Button = styled(Link)<ButtonProps>`
  border-radius: 50px;
  background: ${({ primary }) => (primary ? '#1d4ed8' : '#010606')};
  white-space: nowrap;
  padding: ${({ big }) => (big ? '14px 48px' : '12px 30px')};
  color: ${({ dark }) => (dark ? '#fff' : '#fff')};
  font-size: ${({ fontBig }) => (fontBig ? '20px' : '16px')};
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-out;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: ${({ primary }) => (primary ? '#fff' : '#001BF71')};
  }
`;