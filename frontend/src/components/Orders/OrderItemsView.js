import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Button, Container, Table, Card } from "react-bootstrap";
import Navigationbar from '../Navbar/CustomerNavbarHome.js';
import axios from 'axios';
import endPointObj from '../../endPointUrl.js';

class OrderItemsView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            order_details: {},
            order_items: {}
        };
    }

    componentWillMount() {
        if (this.props.location.state) {
            this.setState({
                order_details: this.props.location.state.order_details,
                prevPath: this.props.location.state.prevPath
            });

            axios.get(endPointObj.url + "/order/orderitems/" + this.props.location.state.order_details._id)
                .then(response => {
                    console.log("Get order by orderid response", response.data);
                    if (response) {
                        console.log("order item view", response.data);
                        this.setState({
                            order_items: response.data
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    render() {
        let order_details;
        let items = [];
        let itemsRender = [];
        let itemsCard = null;
        let redirectVar = null;

        if (!localStorage.getItem("user_id") || !this.props.location.state) {
            redirectVar = <Redirect to="/" />;
        }
        console.log(this.props);
        if (this.state && this.state.order_details && this.state.order_items) {
            console.log("order details", this.state.order_details);
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

            console.log("itemsRender", itemsRender);
            // items.forEach(itm => {
            //     console.log("BYEEE", typeof itm);
            //     console.log("OK", itm);
            //     // let itemRow = (
            //     //     <tr>
            //     //         <td colSpan="4" align="center">{itm.item_id}</td>
            //     //         <td colSpan="4" align="center">{itm.item_quantity}</td>
            //     //     </tr>
            //     // );
            //     // itemsRender.push(itemRow);
            // });          
            
            
            itemsCard =
                (
                    <center>
                        <Card style={{ width: "40rem" }}>
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
                                            <td colSpan="4">Order Instructions:</td>
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
                    <Container className="justify-content">
                        {itemsCard}
                    </Container>
                </div>
            );
        }
    }
}

export default OrderItemsView;