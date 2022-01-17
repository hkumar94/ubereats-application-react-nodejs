import React, { Component } from 'react';
import axios from 'axios';
import { Card, Container, Col, Row, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import endPointObj from '../../endPointUrl.js';

class CustomerOrderHistory extends Component {
    constructor(props) {
        super(props);

        this.getCompletedOrders();
    }

    getCompletedOrders = () => {
        axios.get(endPointObj.url + "/orders/completedorders/" + localStorage.getItem("user_id"))
            .then(response => {
                if (response.data[0]) {
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

    render() {
        let message = null;
        let orders = [];
        let orderCards = null;

        if (this.state && this.state.completed_orders) {
            orders = this.state.completed_orders;
            if (orders.length > 0) {
                orderCards = orders.map(order => {
                    return (
                        <Card style={{ width: "50rem", margin: "2%" }}>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Card.Title>{order.res_name}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{order.res_address} | {order.res_zip_code}</Card.Subtitle>
                                        <Card.Text>{order.order_date}</Card.Text>
                                    </Col>
                                    <Col align="center">
                                        <Link to={{ pathname: "/orders/details", state: {order_details: order, prevPath: "/orders/history"} }}>
                                            <Button variant="link">Order Details</Button>
                                        </Link>
                                        <Link to={{ pathname: "/orders/billing", state: {order_details: order, prevPath: "/orders/history"} }}>
                                            <Button variant="link">Billing Details</Button>
                                        </Link>
                                    </Col>
                                    <Col align="center">
                                        <br />
                                        <b>Order Status</b><br />
                                        {order.order_status}
                                        <br />
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    );

                });
            }
        }
        else {
            message = <Alert variant="warning">You do not have any orders made in the past.</Alert>
        }
        return (
            <div>
                <Container className="justify-content">
                    <h3>Your past orders</h3>
                    {message}
                    {orderCards}
                    <center>
                        <Button href="/customerH
                        ome">Home</Button>
                    </center>
                </Container>
            </div>
        )
    }
}
export default CustomerOrderHistory;