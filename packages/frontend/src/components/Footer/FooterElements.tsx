import styled from "styled-components";
import {Link} from 'react-router-dom';


export const FooterContainer = styled.footer`
    background-color: #1c2434;
`

export const FooterWrap = styled.div`
    padding: 15px 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 1100px;
    margin: 0 auto;
`

export const FooterLinksContainer = styled.div`
    display:flex;
    justify-content: center;
    
    @media screen and (max-width: 820px){
        padding-top: 10px;
    }
`

export const FooterLinksWrapper = styled.div`
    display:flex;
    
    @media screen and (max-width: 820px){
        flex-direction: column;
    }
`

export const FooterLinkItems = styled.div`
    display:flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 16px;
    text-align: left;
    width: 160px;
    box-sizing: border-box;
    color: #fff;

    @media screen and (max-width: 420px){
        margin:0;
        padding: 10px;
        width: 100%;
    }
`

export const FooterLinkTitle = styled.h1`
    font-size:14px;
    margin-bottom: 16px;
`

export const FooterLink = styled(Link)`
    color:#fff;
    text-decoration:none;
    margin-bottom: 0.5rem;
    font-size:14px;
    
    &:hover{
        color: #01bf71;
        transition:0.3s ease-out;
    }
`

export const SocialMedia = styled.section`
    max-width:10000px;
    width:100%;
    
`

export const SocialMediaWrap = styled.div`
    display:flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1100px;
    margin: 40px auto 0 auto;
    
    @media screen and (max-width: 820px){
        flex-direction:column;
    }
`

export const SocialLogo = styled(Link)`
    color:#fff;
    justify-self:start;
    cursor:pointer;
    text-decoration:none;
    font-size: 1.5rem;
    display: flex;
    align-Items: center;
    margin-bottom: 16px;
    font-weight:bold;
`

export const WebsiteRights = styled.small`
    color:#fff;
    margin-bottom:16px;
`

export const SocialIcons = styled.div`
    display: flex;
    justify-content: center; // Center the icons horizontally
    align-items: center; // Center the icons vertically
    width: auto; // Adjust based on your specific needs
    
    @media screen and (max-width: 820px){
        margin-top: 20px; // Add some top margin on smaller screens
    }
`

export const SocialIconsLink = styled.a`
    color: #fff;
    font-size: 24px; // Adjust size as needed
    margin: 0 2px; // Add horizontal space between icons
    transition: color 0.3s; // Smooth transition for color change
    justify-content: center; // Center the icons horizontally

    &:hover {
        color: #9ab0e1; // Change color on hover
        transform: scale(1.1); // Slightly enlarge icons on hover
    }
`
