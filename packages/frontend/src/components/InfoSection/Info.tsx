import React from 'react';
import {
    InfoContainer,
    InfoWrapper,
    InfoRow,
    Column1,
    Column2,
    TopLine,
    Heading,
    Subtitle,
    Button,
    TextWrapper,
    ImgWrap,
    BtnWrap,
    Img,
} from './InfoElements';

interface InfoProps {
    lightBg: boolean;
    id: string;
    imgStart: boolean;
    topLine: string;
    lightText: boolean;
    headline: string;
    darkText: boolean;
    description: string;
    buttonLabel: string;
    img: string;
    primary: boolean;
    dark: boolean;
    dark2?: boolean;
}

const Info: React.FC<InfoProps> = ({
    lightBg, id, imgStart, topLine, lightText, headline, darkText, description, buttonLabel, img, primary, dark, dark2
}) => {
    return (
        <InfoContainer lightBg={lightBg} id={id}>
            <InfoWrapper>
                <InfoRow imgStart={imgStart}>
                    <Column1>
                        <TextWrapper>
                            <TopLine>{topLine}</TopLine>
                            <Heading lightText={lightText}>{headline}</Heading>
                            <Subtitle darkText={darkText}>{description}</Subtitle>
                            <BtnWrap>
                                <Button
                                    to="/Auth/SignInPage"
                                    primary={primary}
                                    dark={dark}
                                    dark2={dark2 || false}
                                >{buttonLabel}</Button>
                            </BtnWrap>
                        </TextWrapper>
                    </Column1>
                    <Column2>
                        <ImgWrap>
                            <Img src={img} />
                        </ImgWrap>
                    </Column2>
                </InfoRow>
            </InfoWrapper>
        </InfoContainer>
    );
}

export default Info;
