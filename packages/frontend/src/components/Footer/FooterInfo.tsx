import {
    FooterContainer,
    FooterLink,
    FooterLinkItems,
    FooterLinkTitle,
    FooterLinksContainer,
    FooterLinksWrapper,
    FooterWrap,

    SocialMedia,
    SocialMediaWrap,
    SocialIcons,
    SocialLogo,
    SocialIconsLink,
    WebsiteRights,


} from './FooterElements'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'

const FooterInfo = () => {
  return (
    <FooterContainer>
        <FooterWrap>
            <FooterLinksContainer>
                <FooterLinksWrapper>
                    <FooterLinkItems>
                            <FooterLinkTitle>About Us</FooterLinkTitle>
                            <FooterLink to="/signin">Who are we</FooterLink>
                            <FooterLink to="/signin">Testimonials</FooterLink>
                            <FooterLink to="/signin">Careers</FooterLink>
                            <FooterLink to="/signin">Investors</FooterLink>
                            <FooterLink to="/signin">Terms of Service</FooterLink>
                    </FooterLinkItems>

                    <FooterLinkItems>
                            <FooterLinkTitle>Contact Us</FooterLinkTitle>
                            <FooterLink to="/signin">Contact</FooterLink>
                            <FooterLink to="/signin">Support</FooterLink>
                    </FooterLinkItems>
                </FooterLinksWrapper>

                <FooterLinksWrapper>
                    <FooterLinkItems>
                            <FooterLinkTitle>About Us</FooterLinkTitle>
                            <FooterLink to="/signin">Terms of Use</FooterLink>
                            <FooterLink to="/signin">Privacy Policy</FooterLink>
                            <FooterLink to="/signin">PRFAQ</FooterLink>
                            
                    </FooterLinkItems>
                    
                </FooterLinksWrapper>
            </FooterLinksContainer>


            <SocialMedia>
                <SocialMediaWrap>
                    <SocialLogo to='/'>EduScribeAI </SocialLogo>
                    <WebsiteRights>EduScribeAI © {new Date().getFullYear()} All rights reserved. </WebsiteRights>
                    <SocialIcons>
                        <SocialIconsLink href="/" target="_blank" aria-label="Facebook">
                            <FaFacebook />
                        </SocialIconsLink>

                        <SocialIconsLink href="/" target="_blank" aria-label="Instagram">
                            <FaInstagram />
                        </SocialIconsLink>

                        <SocialIconsLink href="/" target="_blank" aria-label="Twitter">
                            <FaTwitter />
                        </SocialIconsLink>

                        <SocialIconsLink href="/" target="_blank" aria-label="Linkedin">
                            <FaLinkedin />
                        </SocialIconsLink>

                    </SocialIcons>
                </SocialMediaWrap>
            </SocialMedia>
        </FooterWrap>
    </FooterContainer>
  )
}

export default FooterInfo
