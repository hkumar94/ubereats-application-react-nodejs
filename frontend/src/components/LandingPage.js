import React, { Component } from 'react';
import axios from 'axios';
import endPointObj from '../endPointUrl.js';
import RestaurantCard from "./Landing/RestaurantCard";
import { InputGroup, FormControl, Button, DropdownButton, Dropdown, Alert, Col, Row, Form } from 'react-bootstrap';
import NavigationBar from './Navbar/Navbar.js';
import {Redirect} from 'react-router';
import './Landing/Landing.css';

class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.setState({
            search_input: "",
            noRecord: false
        });

        this.onChange = this.onChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onCuisineSelect = this.onCuisineSelect.bind(this);
    }


    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            noRecord: false
        });
    }

    onSearch = (e) => {
        e.preventDefault();
        
        if (this.state) {
            var searchInput = typeof this.state.search_input === "undefined" || this.state.search_input === "" ? "_" : this.state.search_input;
            let data = {
                searchInput : searchInput,
                delivery : this.state.delivery
            }
            axios.post(endPointObj.url + "/restaurant/restaurantDeliverySearch", data)
                .then(response => {
                    var cuisines = [];
                    if (response.data) {
                        if (response.data === 'NO_RECORD') {
                            this.setState({
                                noRecord: true,
                                search_input: searchInput
                            });
                        }
                        else {
                            for (var i = 0; i < response.data.length; i++) {
                                if(!cuisines.includes(response.data[i].res_cuisine))
                                cuisines.push(response.data[i].res_cuisine)
                            }
                            this.setState({
                                restaurantList: response.data,
                                displayRestaurants: response.data,
                                cuisineList: cuisines,
                                noRecord: false
                            });
                        }
                    }
                })
                .catch(error => {
                    if (error.response && error.response.data) {
                        console.log(error.response.data);
                    }
                })
        }
    }

    onCuisineSelect = (e) => {
        var filteredList = this.state.restaurantList.filter(restaurant => restaurant.res_cuisine === e.target.text);
        this.setState({
            displayRestaurants: filteredList
        });
    }

    render() {
        var cuisineDropdown = null,
            restaurantCards = null,
            noRecordMessage = null;
        let redirectVar = null;  

        if(!localStorage.getItem("user_id")) {
            redirectVar = <Redirect to= "/"/>
        }
        if (this.state && this.state.cuisineList) {
            cuisineDropdown = this.state.cuisineList.map(cuisine => {
                return (
                    <Dropdown.Item href="#" onClick={this.onCuisineSelect}>{cuisine}</Dropdown.Item>
                )
            })
        }

        if (this.state && this.state.displayRestaurants) {
            restaurantCards = this.state.displayRestaurants.map(restaurant => {
                return (
                    <Col md={6}>
                        <RestaurantCard restaurant={restaurant} />
                    </Col>
                );
            });
        }

        if (this.state && this.state.noRecord && this.state.search_input === "") {
            noRecordMessage = (
                <Alert variant="warning">
                    No Restaurants are available now. Please try again later.
                </Alert>
            );
        }
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
                <div className="LandingBackgoundLayer">
                <center><br /><br />
                    <h1 style={{ color: '#ffffff'}}>Welcome to UberEats</h1>
                    <br />
                    <div><br/><br/> 
                    <h4 style={{ color: '#ffffff'}}><i>Search for the Restaurants for delicious food.</i></h4><br/><br/>
                    <Form onSubmit={this.onSearch}>
                        <InputGroup style={{ width: '90%', height: '100%', paddingTop: '0em'}} size="lg">
                            <FormControl
                                style={{ width: '90%', height: '100%'}}
                                placeholder="Search Food, Restaurant, location"
                                aria-label="Search Restaurants"
                                aria-describedby="basic-addon2"
                                name="search_input"
                                className = "searchInputField"
                                onChange={this.onChange}
                            />
                           
                            <center><Button variant="primary" type="submit" className="restoSearchButton"><h5><b>Search</b></h5></Button></center>
                            
                        </InputGroup> 
                    </Form>
                    </div>
                    
                    <br /><br /><br /><br />
                    {noRecordMessage}
                    <Row md="6">{restaurantCards}</Row>
                    <br /><br /><br /><br /><br /><br /><br /><br /><br />
                    
                    
                  
                </center>
                </div>
            </div>
        )
    }
}

export default LandingPage;
