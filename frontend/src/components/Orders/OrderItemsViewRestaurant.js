import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Button, Container, Table, Col, Card } from "react-bootstrap";
import Navigationbar from '../Navbar/RestaurantNavbarHome';
import axios from 'axios';
import endPointObj from '../../endPointUrl.js';

class OrderItemsViewRestaurant extends Component {
    constructor(props) {
        super(props);

        this.state = {
            order_details: {},
            order_items: {},
            o_status:"",
            order_id:"",
            message:""
        };
        this.onChange = this.onChange.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
    }

    componentWillMount() {
        if (this.props.location.state) {
            this.setState({
                order_details: this.props.location.state.order_details,
                prevPath: this.props.location.state.prevPath,
                order_id: this.props.location.state.order_details._id
            });

            axios.get(endPointObj.url + "/order/orderitems/" + this.props.location.state.order_details._id)
                .then(response => {
                    if (response.data) {
                        console.log("order item view", response.data);
                        this.setState({
                            order_items: response.data,
                           
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
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
        console.log("ORDER ID", this.state.order_id);
        const data = {
            order_status : this.state.o_status,
            order_id : this.state.order_id
        }
    
        axios.post(endPointObj.url + '/order/updateStatus', data)
            .then(response => {
                this.setState({
                    message: response.data
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


    render() {
        let order_details;
        let items;
        let itemsRender = [];
        let itemsCard = null;
        let redirectVar = null;
        if (!localStorage.getItem("user_id") || !this.props.location.state) {
            redirectVar = <Redirect to="/" />;
        }

        if(this.state.message == 'ORDER_STATUS_UPDATED') {
            redirectVar = <Redirect to="/orders/orderHistory" />;
        }
       
        if (this.state && this.state.order_details && this.state.order_items) {
            console.log("orderdetails", this.state.order_details);
            order_details = this.state.order_details;
            items = this.state.order_items.item_details;
            console.log("Item details oo", this.state.order_details.item_details);
            this.state.order_details.item_details.map(item => {
                let itemRow = (
                    <tr>
                        <td colSpan="4" align="center">{item.item_name}</td>
                        <td colSpan="4" align="center">{item.item_quantity}</td>
                    </tr>
                );
                itemsRender.push(itemRow);
            });

            itemsCard =
                (
                    <center>
                        <Card style={{ width: "30rem" }}>
                            <Card.Title>
                                <br />
                                <h3>{order_details.resto_name}</h3>
                            </Card.Title>
                            <Card.Body>
                                <b>Order Details</b>
                                <Table>
                                    <thead align="center">
                                        <th colSpan="4">Item Name</th>
                                        <th colSpan="4">Quantity</th>
                                    </thead>
                                    <tbody>
                                        {itemsRender}
                                        <br />
                                        <br />
                                        <tr>
                                            <td colSpan="4">Customer Name:</td>
                                            <td>{order_details.cust_name}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4">Delivery Address:</td>
                                            <td>{order_details.address}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4">Contact Number:</td>
                                            <td>{order_details.phone_number}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4">Order Instruction:</td>
                                            <td>{order_details.order_instruction}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                
                                <Button variant="secondary" href={this.state.prevPath}>Back</Button>
                            </Card.Body>
                        </Card>

                    </center>
                );
            return (
                <div>
                    <Navigationbar /><br />
                    {redirectVar}
                    <Container className="restaurantOrderHistory">
                        {itemsCard} <br/>
                        &nbsp;&nbsp;
                        <center>
                        <form onSubmit={this.onUpdate}>
                         <Col md={9}>   
                         <label>Update order status</label>   
                         <select name="o_status" value= {this.state.o_status} onChange={(e) => this.setState({ o_status: e.target.value })} style={{ width: '10em', height: '2em'}}>
                            <option value="ORDER RECEIVED">ORDER RECEIVED</option>
                            <option value="PREPARING">PREPARING</option>
                            <option value="PICKUP READY">PICKUP READY</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="ORDER_CANCELLED">CANCEL ORDER</option>
                        </select> <br/>

                            {/* <label> Order Status</label>
                            <input type="text" value= {this.state.o_status} onChange={(e) => this.setState({ o_status: e.target.value })} /> */}
                        </Col> &nbsp;&nbsp; 
                        <Col md={8}>   
                        <Button type="submit" variant="success">Update Order Status</Button>
                        </Col>
                        </form>
                        </center>
                    </Container>
                </div>
            );
        }
    }
}

export default OrderItemsViewRestaurant;