import React, { Component } from 'react';
import axios from 'axios';
import endPointObj from '../../endPointUrl.js';
import FavRestaurantCard from '../Landing/FavRestaurantCard.js';
import { InputGroup, FormControl, Button, Form, Dropdown, Alert, Col, Row, FormLabel } from 'react-bootstrap';
import NavigationBar from '../Navbar/CustomerNavbarHome.js';
import {Redirect} from 'react-router';

class FavouriteRestaurant extends Component {
    constructor(props) {
        super(props);
        this.setState({
            search_input: "",
            food_category:"",
            noRecord: false,
            //message:""
        });
    }

    componentDidMount() {
        console.log(endPointObj.url + "/restaurant/getFavRestaurant");
        axios.get(endPointObj.url + "/restaurant/updateFavStatus/" + localStorage.getItem("user_id"))
            .then(response => {
                if (response.data) {
                    console.log("fav Resto data", response.data);
                    this.setState({
                        restaurantList: response.data,
                        displayRestaurants: response.data,
                        //message: response.data
                    });
                    
                }
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    console.log(error.response.data);
                }
            });
    }

    render() {
    
        var restaurantCards = null,
            noRecordMessage = null;
        let redirectVar = null;  

        if (this.state && this.state.displayRestaurants) {
            restaurantCards = this.state.displayRestaurants.map(restaurant => {
                return (
                    <Col md={3}>
                        <FavRestaurantCard restaurant={restaurant} />
                    </Col>
                );
            });
        }

        // if (this.state.message == 'NO_FAVOURITE_RESTAURANT') {
        //     noRecordMessage = (
        //         <Alert variant="warning">
        //             You have not added Favourite Restaurants.
        //         </Alert>
        //     );
        // }
        else if(this.state && this.state.noRecord){
            noRecordMessage = (
            <Alert variant="warning">
                    No Results. Please try again.
                </Alert>
            );
        }
        else {
            noRecordMessage = null;
        }

        return (
            <div>
                {redirectVar}
                <div> <NavigationBar /> </div>
                <center><br /><br />
                    
                    <br />
                    <table>
                    <tr>  
                    <td>
                    
                    </td>
                    <td>
                    <div className="welcomeTitle">
                    <h1>Your Favourite Restaurants</h1>
                    </div>
                    <br /><br />
                    {noRecordMessage}
                    <Row md="6">{restaurantCards}</Row>
                    </td></tr> </table>
                </center>
            </div>
        )
    }
}

export default FavouriteRestaurant;
