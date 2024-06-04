import React from 'react'
import Icon1 from '../../images/Review.svg';
import Icon2 from '../../images/Review.svg';
import Icon3 from '../../images/Review.svg';
import video1 from '../../videos/upload.mp4';


import {
    ServicesContainer,
    ServicesH1,
    ServicesH2,
    ServicesWrapper,
    ServicesCard,
    ServicesIcon,
    ServicesP

} from './serviceElements'

const ServiceInfo = () => {
  return (
    <ServicesContainer id="services">
        <ServicesH1>Our Services</ServicesH1>
        <ServicesWrapper>
            <ServicesCard>
                <ServicesIcon autoPlay loop muted src={video1} type='video/mp4'/>
                <ServicesH2>Upload Your Files</ServicesH2>
                {/* <ServicesP>we help reduce expences and increase your overall revenue.</ServicesP> */}
            </ServicesCard>

            <ServicesCard>
                <ServicesIcon src={Icon2}/>
                <ServicesH2>View the Summary</ServicesH2>
                {/* <ServicesP>we help reduce expences and increase your overall revenue.</ServicesP> */}
            </ServicesCard>

            <ServicesCard>
                <ServicesIcon src={Icon3}/>
                <ServicesH2>View the Assesment</ServicesH2>
                {/* <ServicesP>we help reduce expences and increase your overall revenue.</ServicesP> */}
            </ServicesCard>
        </ServicesWrapper>
    </ServicesContainer>
  )
}

export default ServiceInfo
