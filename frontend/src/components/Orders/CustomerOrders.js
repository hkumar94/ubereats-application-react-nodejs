import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Navigationbar from '../Navbar/CustomerNavbarHome.js';
import axios from 'axios';
import { Card, Container, Col, Row, Button, Alert, FormLabel } from "react-bootstrap";
import { Link } from "react-router-dom";
import endPointObj from '../../endPointUrl.js';
import JwPagination from 'jw-react-pagination';

class CustomerOrders extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            o_status:"",
            pending_orders: [],
            pageOfItems:[],
            pageNumber: "5"
        };

        this.cancelOrder = this.cancelOrder.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.getPendingOrders();
    }

    componentWillMount() {
        document.title = "Your Orders";
    }

    //Pagination
    onChangePage(pageOfItems) {
        // update local state with new page of items
        this.setState({ pageOfItems });
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value, 
            o_status: e.target.value
        });
        console.log("order_status", this.state.o_status);
    };

    onUpdate = (e) => {
        e.preventDefault();
        console.log("ORder status", this.state.o_status);
        const data = {
            order_status : this.state.o_status,
            cust_id : localStorage.getItem("user_id")
        }
    
        axios.post(endPointObj.url + '/order/orderByStatus', data)
            .then(response => {
                this.setState({
                    pending_orders: response.data
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

    cancelOrder = (e) => {
        let pending_orders = this.state.pending_orders;
        let data = {
            order_id: e.target.name
        };

        axios.post(endPointObj.url+ "/order/cancelorder", data)
            .then(response => {
                if (response.data === "ORDER_CANCELLED") {
                    let index = pending_orders.findIndex(order => order.order_id === data.order_id);
                    pending_orders.splice(index, 1);
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

    getPendingOrders = () => {

        axios.get(endPointObj.url+ "/order/pendingorder/"+ localStorage.getItem("user_id"))
            .then(response => {
                if (response.data) {
                    console.log("Order details", response.data);
                    this.setState({
                        pending_orders: response.data
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

     getRestaurantDetails = () => {
        let res_id;
        if (this.props.location.restaurant) {
            res_id = this.props.location.restaurant.resto_id;
            
            axios.get(endPointObj.url + "/restaurant/getRestaurantProfileDetails/" + res_id)
                .then(response => {
                    if (response.data) {
                        this.setState({
                            restaurant: response.data,
                        });
                        localStorage.setItem("restaurant",  response.data);
                    }
                })
                .catch(error => {
                    if (error.response && error.response.data) {
                        console.log(error.response.data);
                    }
                })
        }
    };

    render() {
        console.log("Home page order status", this.state.o_status);
        console.log("Pending orders", this.state.pending_orders);
        console.log("Page number limit", this.state.pageNumber);
        let redirectVar = null;
        let orders = [];
        let orderCards = null;
        let message = null;
        if (!localStorage.getItem("user_id") || localStorage.getItem("is_owner") === "1") {
            redirectVar = <Redirect to="/" />
        }
        if (this.state && this.state.message === "ORDER_CANCELLED") {
            message = <Alert variant="success">Your order is cancelled.</Alert>
        }
        else if (this.state && this.state.message === "ORDER_ERROR") {
            message = <Alert variant="warning">Your order could not be cancelled.</Alert>
        }
        else if (this.state && this.state.message === "NO_PENDING_ORDERS") {
            message = (
                <Link to="/orders/history">
                    <Alert variant="warning">You do not have any pending orders. Click here to view your past orders.</Alert>
                </Link>
            );
        }
        if (this.state && this.state.pending_orders) {
            orders = this.state.pending_orders;
            if (orders.length > 0) {
                orderCards = this.state.pageOfItems.map(order => {
                    console.log("uuuuu", order);
                    return (
                        <Card style={{ width: "50rem", margin: "2%" }}>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Card.Title>{order.resto_name}</Card.Title>
                                        <Row>
                                            <Link to={{ pathname: "/orders/details", state: {order_details: order, prevPath: "/orders"} }}>
                                                <Button variant="link">Order Details</Button>
                                            </Link>
                                            <Link to={{ pathname: "/orders/billing", state: {order_details: order, prevPath: "/orders"}}}>
                                                <Button variant="link">Billing Details</Button>
                                            </Link>
                                        </Row>
                                    </Col>
                                    <Col align="center">
                                        <Card.Text>{order.order_status}</Card.Text>
                                        <Card.Text>{order.order_date}</Card.Text>
                                    </Col>
                                    <Col align="right">
                                        <Button variant="secondary" name={order._id} onClick={this.cancelOrder}>Cancel Order</Button>&nbsp;
                                </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    );
                });
            }
        }
        return (
            <div>
                {redirectVar}
                <Navigationbar /><br />
                <Container className="customerOrder">
                    <h3>Your Orders</h3><br />
                    <center>
                        <form onSubmit={this.onUpdate}>
                         <Col md={12}>   
                         <FormLabel><b>Filter by order status</b></FormLabel>   
                         <select name="o_status" value={this.state.o_status} onChange={(e) => this.setState({ o_status: e.target.value })} style={{ width: '10em', height: '2em'}}>
                            <option value="ORDER_PLACED" selected>ORDER PLACED</option>
                            <option value="ORDER_DELIVERED">ORDER DELIVERED</option>
                            <option value="ORDER_CANCELLED">ORDER CANCELLED</option>
                        </select> &nbsp;&nbsp; 
                        <FormLabel><b>Page Size limit</b></FormLabel>
                        <select name="pageNumber" value={this.state.pageNumber} onChange={(e) => this.setState({ pageNumber: e.target.value })} style={{ width: '10em', height: '2em'}}>
                            <option value="2">2</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                        </select> &nbsp;&nbsp;
                        </Col> &nbsp;&nbsp; 
                        <Col md={12}>   
                        <Button type="submit" variant="success">View orders</Button>
                        </Col>
                        </form>
                       
                        </center>

                    {message}
                    {orderCards}

                    <div style={{ display: 'block' }}>
                        <JwPagination pageSize={this.state.pageNumber} items={this.state.pending_orders} onChangePage={this.onChangePage} />
                    </div>
                    <center>
                        <Button href="/customerHome">Home</Button>
                    </center>
                </Container>
            </div>
        )
    }
}

export default CustomerOrders;