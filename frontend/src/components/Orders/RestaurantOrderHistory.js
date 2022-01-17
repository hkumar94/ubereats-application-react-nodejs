import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Card, Container, Col, Row, Button, Alert, Form, ButtonGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import endPointObj from '../../endPointUrl.js';
import Navigationbar from '../Navbar/RestaurantNavbarHome.js';

class RestaurantOrderHistory extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.cancelOrder = this.cancelOrder.bind(this);
        this.getCompletedOrders();
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onUpdate = (e) => {
        e.preventDefault();

        const data = {
            order_status : this.order_status,
            order_id : this.order_id
        }
    
        axios.post(endPointObj.url + '/orders/updateStatus', data)
            .then(response => {
                this.setState({
                    message: response.data.status
                });
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    this.setState({
                        message: err.response.data
                    });
                }
            });
    };

    getCompletedOrders = () => {
        axios.get(endPointObj.url + "/order/restaurant/orderitems/" + localStorage.getItem("user_id"))
            .then(response => {
                if (response.data) {
                    console.log("restaurant orders page", response.data);
                    this.setState({
                        completed_orders: response.data
                    });
                }
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    this.setState({
                        message: err.response.data
                    });
                }
            });
    };

    cancelOrder = (e) => {
        let pending_orders = this.state.pending_orders;
        let data = {
            order_id: e.target.name
        };

        axios.post(endPointObj.url+ "/order/cancelorder", data)
            .then(response => {
                if (response.data === "ORDER_CANCELLED") { 
                    console.log("Order cancelled");                   
                    this.setState({
                        pending_orders: pending_orders,
                        message: response.data
                    });
                }
            })
            .catch(error => {
                this.setState({
                    message: "ORDER_ERROR"
                });
            });
    };

    render() {
        let message = null;
        let orders = [];
        let orderCards = null;
        if (this.state && this.state.message === "ORDER_CANCELLED") {
            message = <Alert variant="success">Your order is cancelled.</Alert>
        }

        if (this.state && this.state.completed_orders) {
            orders = this.state.completed_orders;
            if(this.state.completed_orders == 'NO_ORDERS') {
                message = <Alert variant="warning">You have no orders.</Alert>    
            }
            else if (orders.length > 0) {
                console.log("Hiiiii", orders);
                orderCards = orders.map(order => {
                    this.state.order_id = order._id;
                    this.state.order_status = order.order_status;
                    return (
                        <Card style={{ width: "50rem", margin: "2%" }}>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Card.Title>{order.cust_name}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{order.order_time}</Card.Subtitle>
                                        {/* <Card.Subtitle className="mb-2 text-muted">{order.phone_number}</Card.Subtitle> */}
                                        <br />
                                        <Card.Text>{order.order_date}</Card.Text>
                                    </Col>
                                    <Col align="center">
                                        <Link to={{ pathname: "restaurant/orders/details", state: {order_details: order, prevPath: "/orders/orderHistory"} }}>
                                            <Button variant="link">Order Details</Button>
                                        </Link>
                                    </Col>
                                    <Col align="center">
                                        <br />
                                        <b>Order Status</b><br />
                                        {order.order_status}
                                        <br />
                                    </Col>
                                    <Col align="right">
                                        <Button variant="secondary" name={order._id} onClick={this.cancelOrder}>Cancel Order</Button>&nbsp;
                                    </Col>
                                    {/* <Col align="center">
                                        <br />
                                        <b>Order Status</b><br/>
                                        {order.order_status}
                                        <br />
                                        <Form onSubmit={this.onUpdate}>
                                        <Form.Group as={Row} className="mb-3"  controlId="name">
                                     
                                        <Form.Control type="text"
                                        name="order_status"
                                        onChange={this.onChange}
                                        rows = "30"
                                        cols = "40"
                                        style={{ width: "80%" }}
                                        />
                                        </Form.Group> 

                                  
                                    <Button type="submit" variant="success">Update Order Status</Button>
                                    <br />
                                    </Form>
                                        <br />
                                    </Col> */}
                                </Row>
                            </Card.Body>
                        </Card>
                    );

                });
            }
        }
        else {
            message = <Alert variant="warning">You do not have any orders yet.</Alert>
        }
        return (
            <div>
                <Navigationbar /><br />
                <Container className="restaurantOrderHistory">
                    <h2>Customer orders</h2>
                    {message}
                    {orderCards}
                    <center>
                    <Button href="/RestaurantHome" style={{ width: "20rem", margin: "2%" }}> GO TO Home</Button>
                    </center>
                </Container>
            </div>
        )
    }
}
export default RestaurantOrderHistory;