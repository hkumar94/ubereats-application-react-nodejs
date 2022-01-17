import React , { useState, Component }  from 'react'
import { Link } from 'react-router-dom';
import './Navbar.css';
import { connect } from 'react-redux';
import { userLogout } from '../../actions/customerLogin.js';


class CustomerNavbarHome extends Component {
    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    
    //handle logout to destroy the cookie
    handleLogout = () => {
        window.localStorage.clear();
        this.props.userLogout();
    };

    render() {  
       
       
        return (
        <div className = "navbar">
            <div className = "leftSide">
                <label className="ubLogo"><b>Uber</b></label> <label className="eatsLogo"><b>Eats</b></label> 
            </div>    
            <div className = "rightSide">
                <Link to="/customerHome"> Home </Link> 
                <Link to="/customerProfile"> Profile </Link>
                <Link to="/favourite"> Favourite </Link>
                <Link to="/orders"> Orders </Link>
                <Link to="/cart"> Cart </Link>
                <Link to="/customerLogin" onClick={this.handleLogout}> Logout </Link>
                
            </div>    
        </div>
        );
    }  
}

export default connect(null, { userLogout })(CustomerNavbarHome);
