import React , { useState }  from 'react'
import { Link } from 'react-router-dom';
import './Navbar.css';


function Navbar() {

    const [openLinks, setOpenLinks] = useState(false);
    const toggleNavbar = () => {
        setOpenLinks(!openLinks);
      };
    return (
    <div className = "navbar">
        <div className = "leftSide" id={openLinks ? "open" : "close"}>
        <label className="ubLogo"><b>Uber</b></label> <label className="eatsLogo"><b>Eats</b></label> 
            <div className="hiddenLinks">
            <Link to="/customerLogin"> Login </Link> 
            <Link to="/customerSignup"> Signup </Link>
            </div>
        </div>    
        <div className = "rightSide">
            <Link to="/customerLogin"> Login </Link> 
            <Link to="/customerSignup"> Signup </Link>
        </div>    
    </div>
);
}

export default Navbar;
