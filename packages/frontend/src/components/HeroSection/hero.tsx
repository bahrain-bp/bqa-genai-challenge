import {useState} from 'react'
import {
    HeroContainer,
    VideoBg,
    HeroBg,
    HeroContent,
    HeroH1,
    HeroP,
    HeroBtnWrapper,
    ArrowForward,
    ArrowRight,
    Button
} from './HeroElements';
import video from '../../videos/video.mp4';



const Hero = () => {
    const [hover, sethover] = useState(false);

    const onHover = () => {
        sethover(!hover);
    }



  return (
    <HeroContainer id="Home">
        <HeroBg>
            <VideoBg autoPlay loop muted src={video} />
        </HeroBg>
        <HeroContent>
            {/* <HeroH1>Transforming Educational Quality Assessment with GenAI</HeroH1> */}
            <HeroH1>Introducing EduScribeAI – The Future of Educational Compliance and Quality Assessment</HeroH1>
            <HeroP>
                
                    Sign In and join the forefront of academic innovation and elevate your 
                            institution's quality compliance with EduScribeAI.
            </HeroP>
            <HeroBtnWrapper>
                <Button 
                    to="/Auth/SignInPage"
                    onMouseEnter={onHover} 
                    onMouseLeave={onHover}
                    primary='true'
                    dark='true'
                    >
                    Sign In {hover? <ArrowForward /> : <ArrowRight />}
                </Button>
            </HeroBtnWrapper>
        </HeroContent>
    </HeroContainer>
  )
}

export default Hero
