import React, {useState} from 'react';
import Navbar from '../components/Navigationar/Navbar';
import SideBars from '../components/Header/sidor/sideBars';
import { BrowserRouter as Router } from 'react-router-dom';
import Hero from '../components/HeroSection/hero';
import Info from '../components/InfoSection/Info';
import { homeObjOne } from '../components/InfoSection/Data';
import { homeObjtwo } from '../components/InfoSection/Data';
import { homeObjthree} from '../components/InfoSection/Data';
import ServiceInfo from "../components/ServicesComp/ServiceInfo";
import styled from 'styled-components';

const PageContainer = styled.div`
    min-height: 100vh; // 100% of the viewport height
    display: flex;
    flex-direction: column;
    overflow-y: auto; /* Allows vertical scrolling */

`;

const HomePage: React.FC = () => {

    const [isOpen, setIsOpen] = useState(false);
    const toggle= () => {
        setIsOpen(!isOpen)
    }

    return (
        <PageContainer>
            <SideBars isOpen={isOpen} toggle={toggle} />
            <Navbar toggle={toggle} /> 
            <Hero />
            <Info {...homeObjOne}/>
            <Info {...homeObjtwo}/>
            {/* <Info {...homeObjthree}/> */}
            <ServiceInfo />

        </PageContainer>     
     
    );
};

export default HomePage;