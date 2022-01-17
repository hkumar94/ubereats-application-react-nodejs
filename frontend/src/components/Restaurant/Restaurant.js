import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import ItemCard from "./ItemCard"
import { Button, Card, Container, Col, Row } from 'react-bootstrap';
import NavigationBar from '../Navbar/CustomerNavbarHome.js';
import endPointObj from '../../endPointUrl.js';
import { Link } from "react-router-dom";
import '../Landing/Landing.css';
import './Restaurant.css';


class Restaurant extends Component {
    constructor(props) {
        super(props);
        this.setState({
            menu_sections: [],
            menu_items: []
        });
        this.sectionItems = this.sectionItems.bind(this);
        this.getSections();
        this.getMenuItems();
    }

    componentWillMount() {
        if (this.props.location.state) {
            document.title = this.props.location.state.resto_name;
        }
    }


    getSections = () => {
        if (this.props.location.state) {
            axios.get(endPointObj.url + "/menu/getMenuSections/" + this.props.location.state._id)
                .then(response => {
                    console.log("Restaurant FE:",response);
                    if (response.data[0]) {
                        this.setState({
                            menu_sections: response.data
                        });
                    }
                })
                .catch(err => {
                    if (err.response && err.response.data) {
                        console.log(err.response.data);
                    }
                });
        }
    };

    getMenuItems = () => {
        if (this.props.location.state) {
            axios.get(endPointObj.url + "/menu/getMenuItems/" + this.props.location.state._id)
                .then(response => {
                    console.log("get menu items FE:", response);
                    if (response.data[0]) {
                        this.setState({
                            menu_items: response.data
                        });
                    }
                })
                .catch(err => {
                    if (err.response && err.response.data) {
                        console.log(err.response.data);
                    }
                });
        }
    };

    sectionItems = (menu_section) => {
        var itemsRender = [], items, item, section;


        if (this.state && this.state.menu_items && this.state.menu_items.length > 0) {
            items = this.state.menu_items.filter(menu_item => menu_item.item_category === menu_section.menu_section_name);
            if (items.length > 0) {
                section = <h4>{menu_section.menu_section_name}</h4>;
                itemsRender.push(section);
                for (var i = 0; i < items.length; i++) {
                    item = <Col md={6}><ItemCard menu_item={items[i]} /></Col>;
                    itemsRender.push(item);
                }
            }
            return itemsRender;
        }
    };

    render() {
        let redirectVar = null,
            section = null,
            renderOutput = [],
            resImageSrc = null,
            resName, resPhone, resAddress, resCuisine, resZIP,restoEmail,restoDescription,resTiming,
            restaurant = this.props.location.state;

        if (!localStorage.getItem("user_id") || !this.props.location.state) {
            alert("Please login to explore the food at your favourite restaurant");
            redirectVar = <Redirect to="/CustomerLogin" />
        }

        if (restaurant) {
            resImageSrc = endPointObj.frontendServer + "/images/restaurant/" + restaurant.res_image;
            resName = restaurant.resto_name;
            restoEmail = restaurant.email_id;
            resZIP = restaurant.zipcode;
            resAddress = restaurant.address;
            resPhone = restaurant.phone_number;
            resCuisine = restaurant.res_cuisine;
            restoDescription = restaurant.resto_description;
            resTiming = restaurant.timings;
        }
        if (this.state && this.state.menu_sections && this.state.menu_sections.length > 0) {
            for (var i = 0; i < this.state.menu_sections.length; i++) {
                section = this.sectionItems(this.state.menu_sections[i]);
                renderOutput.push(section);
            }
        }
        return (
            <div style={{paddingLeft:"0em", paddingRight:"-30em"}}>
                {redirectVar}
                <NavigationBar />

                <Card style={{ width: "95%", height: "20rem", margin: "2%", backgroundColor: "#ffffff", paddingRight:"0em" }}>
                    <Row>
                        <Col md={7}>
                            <Card.Img style={{ width: "50rem", height: "20rem" }} src={resImageSrc} />
                        </Col>
                        <Col>
                        <Card.Body md={4}>
                            <Card.Title><h2 style={{ color:"#000000" }}>{resName}</h2></Card.Title>
                            <Col md={2}><Card.Text style={{ width: "17rem", color:"#000000" }}><b>Location:</b> {resAddress} | {resZIP}</Card.Text></Col>
                            <Col md={2}><Card.Text style={{ width: "20rem", color:"#000000"  }}><b>Contact:</b> <Link>{restoEmail}</Link> | {resPhone}</Card.Text></Col>
                            <Col md={2}><Card.Text style={{ width: "17rem", color:"#000000"  }}><b>About us:</b> {restoDescription}</Card.Text></Col>
                            <Col md={2}><Card.Text style={{ width: "17rem",color:"#000000"  }}><b>Timings:</b> <br/> {resTiming}</Card.Text></Col>
                        </Card.Body>
                        </Col>
                    </Row>
                </Card>

                <div className = "restoMenuDisplay">
                    {renderOutput}
                </div>

                <br/>
            </div>
        )
    }
}

export default Restaurant;