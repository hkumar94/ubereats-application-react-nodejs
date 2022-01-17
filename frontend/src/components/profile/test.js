import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCustomer, updateCustomer } from '../../actions/customerProfileActions'
import { Link } from "react-router-dom";
import './CustProfile.css';
import NavigationBar from '../Navbar/CustomerNavbarHome.js';
import { Container, Col, Row, Form, Button, ButtonGroup, Card } from 'react-bootstrap';

class CustomerProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onChange = this.onChange.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
    }

    componentWillMount() {
        this.props.getCustomer();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.user) {
            var { user } = nextProps;

            var userData = {
                user_id: user.user_id || this.state.user_id,
                name: user.name || this.state.name,
                email_id: user.email_id || this.state.email_id,
                address: user.address || this.state.address,
                phone_number: user.phone_number || this.state.phone_number
            };
            console.log("Userdata name"+userData.name);
            console.log("Userdata address"+userData.address);
            console.log("Userdata phone"+userData.phone_number);
            this.setState(userData);
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    onUpdate = (e) => {
        console.log("Updating the customer details - frontend");
        //prevent page from refresh
        e.preventDefault();

        let data = Object.assign({}, this.state);
        this.props.updateCustomer(data);
    };

    render() {

        return (
            <div className= "profileBackGroundLayer">
                    <div> <NavigationBar /> </div>
                    <br/><br/>
                    <div className="profileContainer"> 
                  
                        <div className="profileLabel"><b>Profile</b></div>
                        <br />
                
                        <form>
                            <table> 
                                <tr>
                                <td><label className="inputLabel"><b>Name</b></label></td>
                                <td><input type="text" name="name"
                                    type="text"
                                    onChange={this.onChange}
                                    value={this.state.name}
                                    pattern="^[A-Za-z0-9 ]+$"
                                    size="40"
                                    required={true} /> </td> 
                                </tr><br/><br/>                 
                            
                                <tr>
                                <td><label className="inputLabel"><b>Email</b></label></td>
                                <td><input type="email"
                                    name="email_id"
                                    value={this.state.email_id}
                                    size="40"
                                    disabled /></td>
                                </tr><br/><br/>    
                              
                                
                                <tr>
                                <td><label className="inputLabel"><b>Change Password</b></label></td>
                                <td><input type="password"
                                    name="password"
                                    onChange={this.onChange}
                                    size="40"
                                    placeholder="New Password" /></td>
                                </tr><br/><br/>    
                              
                        
                                <tr>
                                <td><label className="inputLabel"><b>Address</b></label></td>
                                <td><input type="text"
                                    name="address"
                                    onChange={this.onChange}
                                    value={this.state.address}
                                    pattern="^[A-Za-z0-9 ,-]+$"
                                    size="40"
                                    required={true} /></td>
                                </tr><br/><br/>    
                              
                                <tr>
                                <td><label className="inputLabel"><b>Phone Number</b></label></td>
                                <td><input type="text"
                                    name="phone_number"
                                    onChange={this.onChange}
                                    value={this.state.phone_number}
                                    required={true}
                                    size="40"
                                    pattern="^[0-9]+$"/></td>
                                </tr><br/><br/>    
                               
                                <div class ="buttonDiv">
                                 
                                <button type="submit" variant="success" onSubmit="onUpdate();" className="submit-btn-primary">Update Profile</button>
                                <br/><br/>
                                <Link to="/customerHome"><button variant="secondary" className="submit-btn-primary">Cancel</button></Link>
                                </div>
                           
                            </table>
                        </form>
                      
                       
                    </div><br/><br/><br/> <br/>
               
            </div>
        )
    }

    
}

CustomerProfile.propTypes = {
    getCustomer: PropTypes.func.isRequired,
    updateCustomer: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    user: state.customerProfile.user
});

export default connect(mapStateToProps, { getCustomer, updateCustomer })(CustomerProfile);