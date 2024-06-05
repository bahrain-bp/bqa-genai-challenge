
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
   
    
} from './InfoElements'

interface InfoProps {


const Info: React.FC<InfoProps> = ({lightBg,id,imgStart,topLine,lightText,headline,darkText,description,buttonLabel,img,primary,dark,dark2}) => {
  return (
    <>
    <InfoContainer lightbg={lightBg} id={id}>
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
                        smooth={true}
                        duration={500}
                        spy={true}
                        exact="true"
                        offset={-80}
                        primary= {primary ? 1:0}
                        dark ={dark ? 1:0}
                        dark2 ={dark2 ? 1:0}
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
    </>
  )
}

export default Info
