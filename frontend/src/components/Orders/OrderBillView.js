import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Button, Container, Table, Card } from "react-bootstrap";
import Navigationbar from '../Navbar/CustomerNavbarHome.js';
import './order.css';

class OrderBillView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            order_details: {}
        };
    }

    componentWillMount() {
        if (this.props.location.state) {
            this.setState({
                order_details: this.props.location.state.order_details,
                prevPath: this.props.location.state.prevPath
            });
        }
    }

    render() {
        let order_details;
        let billCard = null;
        let redirectVar = null;

        if(!localStorage.getItem("user_id") || !this.props.location.state){
            redirectVar = <Redirect to="/" />;
        }
        console.log(this.props);
        if (this.state && this.state.order_details) {
            order_details = this.state.order_details
            billCard =
                (
                    <center>
                        <Card style={{ width: "35em", height: "42rem"}}>
                            <Card.Title>
                                <br />
                                <h3>{order_details.resto_name}</h3>
                            </Card.Title>
                            <Card.Body>
                                <Table style={{ width: "25em" }}>
                                    <tbody>
                                        <tr>
                                            <td colSpan="4">Sub Total</td>
                                            <td align="center">$ {order_details.sub_total}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4">Tax ({this.state.tax}%)</td>
                                            <td align="center">$ {order_details.tax}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4">Discounts</td>
                                            <td align="center">$ {order_details.discount}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4">Delivery Charges</td>
                                            <td align="center">$ {order_details.delivery}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4"><b>Total</b></td>
                                            <td align="center"><b>$ {order_details.total_price}</b></td>
                                        </tr>
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
                    <Container className="orderBillView">
                        {billCard}
                    </Container>
                </div>
            );
        }
    }
}

export default OrderBillView;

