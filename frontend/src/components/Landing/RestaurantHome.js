import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { getRestaurant, updateRestaurant } from '../../actions/restaurantProfileActions';
import './Landing.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavigationBar from '../Navbar/RestaurantNavbarHome.js';
import { Container, Col, Row, Form, Button, ButtonGroup, Card } from 'react-bootstrap';
import endPointObj from '../../endPointUrl.js';

class RestaurantHome extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
      this.props.getRestaurant();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.user) {
          var { user } = nextProps;

          var userData = {
              user_id: user.user_id || this.state.user_id,
              name: user.resto_name || this.state.name,
              description: user.resto_description || this.state.description,
              email_id: user.email_id || this.state.email_id,
              address: user.address || this.state.address,
              phone_number: user.phone_number || this.state.phone_number,
              timings : user.timings || this.state.timings,
              res_image: user.res_image || this.state.res_image
          };
          console.log("Restaurant name"+userData.name);
          console.log("Restaurant address"+userData.address);
          console.log("Restaurant image"+userData.res_image);
          this.setState(userData);
      }
  }

  render() {
      var resImageSrc, res_title;
      let redirectVar = null;  

      if(!localStorage.getItem("user_id")) {
            redirectVar = <Redirect to= "/customerLogin"/>
       }
      if (this.state) {
          resImageSrc = endPointObj.frontendServer + '/images/restaurant/' + this.state.res_image;
          res_title = this.state.name;
      }

      return (
          <div className= "restoHomeBackGroundLayer">
                  { redirectVar }
                  <div> <NavigationBar /> </div>
                  
                  <div className="restaurantHomeContainer"> 

                  <center>
                        <Card style={{ width: '18rem', height: '10em' }}>
                            <Card.Img style={{ width: '18em', height: '10em'}} variant="top" src={resImageSrc} />
                            <Card.Body>
                                
                            </Card.Body>
                        </Card>
                                
                  </center>
                  <br/>
                
                  <div className="profileLabel"><b><u>PROFILE</u></b></div><br/>
                
                  <table>
                    <tr>  
                    <td><label className='floatLabel'><b> Restaurant Name: </b></label></td>
                    <td><label className='floatLabel'><b> {this.state.name}  </b></label></td>  
                    </tr>
                    <br/>
                    <tr>  
                    <td><label className='floatLabel'><b> Description: </b></label></td>
                    <td><label className='floatLabel'><b> {this.state.description} </b></label></td>  
                    </tr>
                    <br/>
                    <tr>  
                    <td><label className='floatLabel'><b> Address: </b></label></td>
                    <td><label className='floatLabel'><b> {this.state.address} </b></label></td>  
                    </tr>
                    <br/>
                    <tr>  
                    <td><label className='floatLabel'><b> Phone Number: </b></label></td>
                    <td><label className='floatLabel'><b> {this.state.phone_number} </b></label></td>  
                    </tr>
                    <br/>
                    <tr>  
                    <td><label className='floatLabel'><b> Timings: </b></label></td>
                    <td><label className='floatLabel'><b> {this.state.timings} </b></label></td>  
                    </tr>
                    <br/>
     
              </table>  
                
              </div><br/><br/><br/> 
            
          </div>
      )
  }
}

RestaurantHome.propTypes = {
  getRestaurant: PropTypes.func.isRequired,
  updateRestaurant: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.restaurantProfile.user
});

export default connect(mapStateToProps, { getRestaurant, updateRestaurant })(RestaurantHome);