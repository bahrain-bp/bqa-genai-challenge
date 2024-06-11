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
import { FaFacebook, FaInstagram, FaTwitter, FaGithub, FaGoogle, FaYoutube} from 'react-icons/fa'

const FooterInfo = () => {
  return (
    <FooterContainer>
        <FooterWrap>
            <FooterLinksContainer>
                <FooterLinksWrapper>
                    <FooterLinkItems>
                            {/* <FooterLinkTitle>About Us</FooterLinkTitle>
                            <FooterLink to="/signin">Who are we</FooterLink>
                            <FooterLink to="/signin">Testimonials</FooterLink>
                            <FooterLink to="/signin">Careers</FooterLink>
                            <FooterLink to="/signin">Investors</FooterLink>
                            <FooterLink to="/signin">Terms of Service</FooterLink> */}
                    </FooterLinkItems>

                    <FooterLinkItems>
                            {/* <FooterLinkTitle>Contact Us</FooterLinkTitle>
                            <FooterLink to="/signin">Contact</FooterLink>
                            <FooterLink to="/signin">Support</FooterLink> */}
                    </FooterLinkItems>
                </FooterLinksWrapper>

                <FooterLinksWrapper>
                    <FooterLinkItems>
                            {/* <FooterLinkTitle>About Us</FooterLinkTitle>
                            <FooterLink to="/signin">Terms of Use</FooterLink>
                            <FooterLink to="/signin">Privacy Policy</FooterLink>
                            <FooterLink to="/signin">PRFAQ</FooterLink> */}
                            
                    </FooterLinkItems>
                    
                </FooterLinksWrapper>
            </FooterLinksContainer>


            <SocialMedia>
                <SocialMediaWrap>
                    <SocialLogo to='/'>EduScribeAI </SocialLogo>
                    <WebsiteRights>EduScribeAI © {new Date().getFullYear()} All rights reserved. </WebsiteRights>
                    <SocialIcons>
                        <SocialIconsLink href="https://www.facebook.com/bqa.bh/" target="_blank" aria-label="Facebook">
                            <FaFacebook />
                        </SocialIconsLink>

                        <SocialIconsLink href="/https://www.instagram.com/bqa_bh/" target="_blank" aria-label="Instagram">
                            <FaInstagram />
                        </SocialIconsLink>

                        <SocialIconsLink href="https://x.com/i/flow/login?redirect_after_login=%2FBQA_bh" target="_blank" aria-label="Twitter">
                            <FaTwitter />
                        </SocialIconsLink>

                        <SocialIconsLink href="https://www.bqa.gov.bh/en/pages/home.aspx" target="_blank" aria-label="Linkedin">
                            <FaGoogle/>
                        </SocialIconsLink>

                        <SocialIconsLink href="/" target="_blank" aria-label="Github">
                            <FaGithub />
                        </SocialIconsLink>

                        <SocialIconsLink href="https://www.youtube.com/channel/UC0t2O757tt3X66n_rxMz3pA" target="_blank" aria-label="Github">
                            <FaYoutube/>
                        </SocialIconsLink>



                    </SocialIcons>
                </SocialMediaWrap>
            </SocialMedia>
        </FooterWrap>
    </FooterContainer>
  )
}

export default FooterInfo
