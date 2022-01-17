import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavigationBar from '../Navbar/Navbar';
import '../Signup/Signup.css';
import './Login.css';
import { customerLogin } from '../../actions/customerLogin';
const jwt_decode = require('jwt-decode');


class CustomerLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }



    onSubmit = (e) => {
        e.preventDefault();
        const data = {
            email_id: this.state.email_id,
            password: this.state.password
        }

        //Calling backend funtion by sending props to reducer.
        this.props.customerLogin(data);

        this.setState({
            loginFlag: 1,
            token: this.props.user
        });
    }

    render() {
        console.log("this.props.user", this.props.user);
        console.log("Token", this.props.user);

        let redirectVar = null;
        let message = ""
        if (this.props.user.length > 0) {
            localStorage.setItem("token", this.props.user);

            var decoded = jwt_decode(this.props.user.split(' ')[1]);
            console.log("Decoded", decoded);
            localStorage.setItem("user_id", decoded._id);
            localStorage.setItem("email_id", decoded.email_id);
            
            redirectVar = <Redirect to="/customerHome" />
        } else if (!localStorage.getItem("user_id")) {
            //message = "Invalid username or password!";
            redirectVar = <Redirect to="/customerLogin" />
        }
          
        console.log(this.props);
        return (
            <div className= "loginBackGroundLayer">
                {redirectVar}
                    <div> <NavigationBar /> </div>
                    <br/><br/>
                  
                   
                    <div className="container"> 
                    <h2><u>Customer Login</u></h2> <br/>
                                <form onSubmit={this.onSubmit}>
                                    <table>
                                    <tr>
                              
                                        <td><label className='floatLabel'><b> Username </b></label></td>
                                        <td><input type="email" className="input_field" name="email_id" onChange={this.onChange} placeholder="Email Id" pattern="^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$'%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])$" title="Please enter valid email address" required /></td>
                             
                                    </tr>
                                    <tr>
                                    
                                        <td><label className='floatLabel'><b> Password </b></label></td>
                                        <td><input type="password" className="input_field" name="password" onChange={this.onChange} placeholder="Password" required /></td>
                                 
                                    </tr>
                                    </table>
                                    <div style={{ color: "#ff0000" }}>{message}</div><br />
                                    <button type="submit" className="btn-primary"><center>Login</center></button><br /><br />
                                    <div><Link to='/restaurantLogin' className="signupLinkClass"><b>Login as Restaurant Owner</b></Link></div><br />
                                                                      
                                </form>
                    </div> <br/> <br/>   
                    </div>
            
        )
    }
}

CustomerLogin.propTypes = {
    customerLogin: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
}

//Connects a redux state to the props of a react component.
const mapStateToProps = state => { 
    return {user: state.login.user}
};

export default connect(mapStateToProps, { customerLogin })(CustomerLogin);