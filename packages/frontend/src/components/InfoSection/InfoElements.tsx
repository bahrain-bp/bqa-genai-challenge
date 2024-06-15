import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { LinkProps } from 'react-router-dom';

// interface InfoProps {
//     lightBg: boolean;
//     imgStart: boolean;
//     lightText: boolean;
//     darkText: boolean;
// }

interface ButtonProps extends LinkProps {
    primary?: boolean;
    dark?: boolean;
    dark2?: boolean;
    big?: boolean; // If you're using this, it wasn't passed in your example
    fontBig?: boolean; // If you're using this, it wasn't passed in your example
}

interface HeadingProps {
    lightText: boolean;
}
interface SubtitleProps {
    darkText: boolean;
}

export const InfoContainer = styled.div<{ lightBg: boolean }>`
    background: ${({ lightBg }) => (lightBg ? '#f9f9f9' : '#fff')};
    color: #fff;
    //padding: 100px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    @media screen and (max-width:768px){
        padding: 100px 0;
    }
`;


export const InfoWrapper = styled.div`
    display: grid;
    z-index: 1;
    height: 660px;
    width: 100%;
    max-width: 1100px;
    margin-right: auto;
    margin-left: auto;
    padding: 0 24px;
    justify-content: center;
`;

export const InfoRow = styled.div<{ imgStart: boolean }>`
    display: grid;
    grid-auto-columns: minmax(auto, 1fr);
    align-items: center;
    grid-template-areas: ${({ imgStart }) => (imgStart ? `'col2 col1'` : `'col1 col2'`)};

    @media screen and (max-width: 768px) {
        grid-template-areas: ${({ imgStart }) => (imgStart ? `'col1' 'col2'` : `'col1 col1' 'col2 col2'`)};
    }
`;


export const Column1 = styled.div`
    margin-bottom: 15px;
    padding: 0px 15px;
    grid-area: col1;
`;

export const Column2 = styled.div`
    margin-bottom: 15px;
    padding: 0 15px;
    grid-area: col2;
`;

export const TextWrapper = styled.div`
    max-width: 540px;
    padding-top: 0;
    padding-bottom: 60px;
`;

export const TopLine = styled.p`
    color: #1d4ed8;
    font-size: 16px;
    line-height: 16px;
    font-weight: 700;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    margin-bottom: 16px;
`;

export const Heading = styled.h1<HeadingProps>`
    //color: ${({ lightText }) => (lightText ? '#f7f8fa' : '#010606')};
    color:black;
    margin-bottom: 24px;
    font-size: 48px;
    line-height: 1.1;
    font-weight: 600;

    @media screen and (max-width: 480px) {
        font-size: 32  px;
    }
`;

export const Subtitle = styled.p<SubtitleProps>`
    //color: ${({ darkText }) => (darkText ? '#010606' : '#fff')};
    color:black;
    margin-bottom: 35px;
    max-width: 440px;
    font-size: 18px;
    line-height: 24px;
`;

export const BtnWrap = styled.div`
    display: flex;
    justify-content: flex-start;
`;

export const ImgWrap = styled.div`
    max-width: 555px;
    height: 100%;
`;

export const Img = styled.img`
    width: 100%;
    margin: 0 0 10px 0;
    padding-right: 0;
`;

export const Button = styled(Link)<ButtonProps>`
    border-radius: 50px;
    background: ${({ primary }) => (primary ? '#1d4ed8' : '#010606')};
    white-space: nowrap;
    padding: ${({ big }) => (big ? '14px 48px' : '12px 30px')};
    color: white;
    font-size: ${({ fontBig }) => (fontBig ? '20px' : '16px')};
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease-in-out;

    &:hover {
        background: ${({ primary }) => (primary ? '#fff' : '#001BF71')};
    }
`;
