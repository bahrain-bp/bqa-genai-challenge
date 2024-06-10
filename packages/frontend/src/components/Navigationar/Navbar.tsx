import {useState, useEffect} from 'react';
import { FaBars } from 'react-icons/fa';
//import {IconContext} from 'react-icons/lib';
import { animateScroll as scroll } from 'react-scroll';
import {
  Nav,
  NavbarContainer,
  NavLogo,
  MobileIcon,
  NavMenu,
  NavItem,
  NavLinks,
  NavBtn,
  NavbtnLink
} from './NavBarElements';


const Navbar = ({ toggle }: { toggle: () => void }) => {
  const [scrollNav, setScrollNav] = useState(false);

  const changeNav= () => {
    if(window.scrollY >= 80){
      setScrollNav(true)
    }else {
      setScrollNav(false)
    }
  }

  useEffect(()=>{
window.addEventListener('scroll',changeNav)}, []);

const toggleHome = () =>{
  scroll.scrollToTop()
}


  return (

  // <IconContext.Provider value= {{'color:#fff'}}>
    <Nav scrollNav={scrollNav}>
        <NavbarContainer>
            <NavLogo to='' onClick={toggleHome}>
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="618.000000pt" height="392.000000pt" viewBox="0 0 618.000000 392.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,392.000000) scale(0.100000,-0.100000)"
fill="White" stroke="none">
<path d="M3164 2909 c-65 -6 -158 -49 -175 -81 -14 -26 -31 -22 -64 12 -56 58
-112 70 -331 70 l-195 0 3 -442 c3 -436 3 -444 25 -478 12 -20 40 -46 61 -58
35 -19 54 -22 164 -22 152 0 200 -14 262 -76 25 -24 51 -44 58 -44 8 0 30 16
49 36 62 65 98 77 254 84 144 7 181 17 217 57 44 48 45 62 40 511 -2 235 -6
428 -7 430 -6 6 -299 7 -361 1z m-356 -54 c32 -10 67 -30 92 -54 37 -35 40
-41 40 -94 0 -52 -10 -71 -24 -48 -3 5 -27 19 -53 32 -44 21 -65 24 -233 29
l-185 5 -3 64 c-2 45 1 67 10 72 24 16 300 10 356 -6z m495 -12 c8 -42 9 -678
1 -686 -4 -3 -19 2 -34 13 -26 18 -27 18 -56 -1 -16 -10 -32 -19 -36 -19 -10
0 -11 704 -1 713 3 4 32 7 63 7 55 0 58 -1 63 -27z m185 -383 c3 -356 1 -409
-13 -436 -27 -52 -60 -64 -173 -64 -122 0 -193 -13 -246 -44 -23 -13 -45 -24
-51 -25 -12 -1 -11 -21 -14 473 l-3 398 28 29 c29 31 92 64 102 55 3 -4 8
-182 11 -397 l6 -390 50 35 c27 20 54 36 58 36 5 0 27 -13 50 -28 23 -16 47
-31 52 -34 7 -4 9 130 6 398 l-3 405 68 -3 69 -3 3 -405z m-682 205 c27 -8 68
-30 91 -50 35 -30 42 -43 48 -86 9 -64 -3 -79 -42 -52 -61 43 -117 53 -295 53
l-168 0 0 69 0 70 43 4 c114 10 276 6 323 -8z m36 -203 c26 -13 61 -39 78 -58
25 -29 30 -43 30 -84 0 -28 -3 -50 -6 -50 -4 0 -36 15 -72 33 -66 32 -68 32
-247 37 l-180 5 -3 72 -3 72 123 4 c165 4 225 -1 275 -25z m5 -194 c23 -10 56
-35 73 -54 25 -29 30 -43 30 -84 0 -28 -3 -50 -6 -50 -3 0 -19 9 -34 20 -55 39
-107 50 -239 50 -81 0 -135 5 -151 13 -33 17 -70 74 -70 108 l0 29 177 0 c158
0 181 -2 219 -21z"/>
<path d="M3428 1523 c-17 -4 -18 -24 -18 -228 0 -256 -9 -235 102 -237 43 -1
76 5 101 17 97 46 105 229 13 287 -25 16 -43 18 -93 14 l-63 -5 0 79 c0 82 -1
84 -42 73z m157 -199 c25 -10 45 -58 45 -108 0 -60 -34 -102 -92 -111 -58 -10
-68 6 -68 116 0 73 3 90 18 98 19 12 72 14 97 5z"/>
<path d="M1888 1513 c-14 -3 -18 -19 -20 -81 -2 -62 -6 -76 -18 -73 -83 19
-140 0 -175 -59 -26 -45 -27 -141 -1 -188 30 -58 114 -83 219 -66 l37 7 0 233
c0 244 1 239 -42 227z m-49 -204 l32 -11 -3 -102 -3 -101 -49 1 c-40 0 -53 5
-72 27 -58 68 -24 196 52 197 6 0 25 -5 43 -11z"/>
<path d="M3235 1499 c-4 -5 -4 -21 -1 -35 5 -17 13 -24 31 -24 29 0 47 27 34
52 -11 20 -54 24 -64 7z"/>
<path d="M4243 1434 c-14 -30 -51 -124 -82 -207 -50 -130 -56 -153 -42 -159
37 -16 49 -8 67 45 l19 52 97 3 96 3 17 -51 c16 -47 18 -50 51 -50 32 0 35 2
28 23 -11 36 -100 257 -133 330 -28 62 -33 67 -61 67 -28 0 -34 -6 -57 -56z
m100 -111 c19 -49 33 -91 30 -95 -5 -9 -153 -11 -153 -3 0 4 28 81 59 158 6
15 15 27 20 27 5 0 25 -39 44 -87z"/>
<path d="M4573 1399 c4 -51 7 -145 7 -211 l0 -118 31 0 30 0 -3 208 -3 207
-34 3 -34 3 6 -92z"/>
<path d="M1318 1453 c-2 -5 -1 -98 2 -208 l5 -200 30 1 c17 0 78 1 138 2 107
2 107 2 107 27 l0 25 -110 0 -110 0 0 70 0 69 88 3 c82 3 87 4 90 26 3 22 0
22 -87 22 l-91 0 0 60 0 59 97 3 c92 3 96 4 98 26 2 22 0 22 -126 22 -70 0
-129 -3 -131 -7z"/>
<path d="M3885 1381 c-48 -12 -74 -33 -95 -77 -36 -73 -22 -162 35 -214 24
-23 35 -25 110 -25 46 0 86 2 89 5 3 3 3 15 0 27 -5 19 -11 20 -65 16 -67 -6
-103 10 -120 54 -14 37 0 43 115 43 l98 0 -7 48 c-13 94 -78 143 -160 123z
m58 -52 c23 -10 47 -46 47 -69 0 -6 -36 -10 -81 -10 -79 0 -80 0 -74 23 8 26
50 67 70 67 8 0 25 -5 38 -11z"/>
<path d="M2777 1366 c-20 -8 -43 -19 -51 -25 -26 -22 -46 -79 -46 -133 0 -99
56 -158 152 -158 61 0 78 7 78 34 0 21 -3 22 -55 18 -50 -4 -57 -2 -85 26 -26
26 -30 38 -30 84 0 31 6 62 15 75 19 28 77 46 115 38 27 -6 30 -4 30 18 0 19
-6 26 -31 31 -41 8 -47 7 -92 -8z"/>
<path d="M3023 1369 l-33 -10 0 -149 0 -150 30 0 30 0 0 129 0 129 28 5 c15 3
39 3 53 0 21 -4 27 0 32 18 4 14 1 27 -6 31 -16 10 -94 8 -134 -3z"/>
<path d="M2435 1358 c-30 -17 -44 -40 -45 -71 0 -46 17 -65 84 -96 68 -30 86
-55 61 -80 -16 -17 -86 -21 -121 -8 -18 6 -22 3 -26 -17 -6 -32 5 -36 91 -36
79 0 115 20 126 71 10 44 -16 76 -91 109 -54 25 -64 33 -64 54 0 34 32 50 85
42 36 -4 44 -2 48 14 3 11 -1 21 -10 24 -25 10 -117 6 -138 -6z"/>
<path d="M3240 1215 l0 -155 30 0 30 0 0 155 0 155 -30 0 -30 0 0 -155z"/>
<path d="M2040 1251 c0 -155 17 -190 102 -206 31 -6 145 8 156 19 2 3 1 70 -3
150 l-8 146 -27 0 -28 0 2 -127 1 -126 -28 -8 c-38 -10 -86 8 -98 38 -5 13 -9
69 -9 124 l0 99 -30 0 -30 0 0 -109z"/>
</g>
</svg>
            </NavLogo>
            <MobileIcon onClick={toggle}>
              <FaBars />
            </MobileIcon>
            <NavMenu>
              <NavItem>
                {/* exact='true' */}
                <NavLinks to="about" smooth={true} duration={500} spy={true}  offset={-80} >About</NavLinks>
              </NavItem>
              <NavItem>
                <NavLinks to="discover" smooth={true} duration={500} spy={true} offset={-80} >Discover</NavLinks>
              </NavItem>
              <NavItem>
                <NavLinks to="services" smooth={true} duration={500} spy={true}  offset={-80} >Services</NavLinks>
              </NavItem>
              {/* <NavItem>
                <NavLinks to="signup" smooth={true} duration={500} spy={true} exact='true' offset={-80} >Sign Up</NavLinks>
              </NavItem> */}
            </NavMenu>
            <NavBtn>
              <NavbtnLink to="/Auth/SignInPage">Sign In</NavbtnLink>
            </NavBtn>
        </NavbarContainer>
    </Nav>
    // </IconContext.Provider>
  );
};

export default Navbar;