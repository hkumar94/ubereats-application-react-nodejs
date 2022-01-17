import React , { useState, Component }  from 'react'
import { Link } from 'react-router-dom';
import './Navbar.css';
import { connect } from 'react-redux';
import { userLogout } from '../../actions/customerLogin.js';


class RestaurantNavbarHome extends Component {

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
            <Link to="/restaurantHome"> Home </Link> 
                <Link to="/menu"> Menu </Link>
                <Link to="/orders/orderHistory"> Orders </Link>
                <Link to="/restaurantProfile"> Update Profile </Link> 
                <Link to="/restaurantLogin" onClick={this.handleLogout}> SignOut </Link>     
            </div>    
        </div>
        );
    }  
}

export default connect(null, { userLogout })(RestaurantNavbarHome);
