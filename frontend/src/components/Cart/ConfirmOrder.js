import React, { Component } from 'react';
import { Redirect } from 'react-router';
import endPointObj from '../../endPointUrl.js';
import { Button, Alert, Container, Table, Card } from "react-bootstrap";
import Navigationbar from '../Navbar/CustomerNavbarHome';
import { Form} from "react-bootstrap";

import axios from 'axios';

class ConfirmOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order_instruction : ""
        };

        this.getUserProfile();
        this.placeOrder = this.placeOrder.bind(this);
    }
    componentWillMount() {
        document.title = "Your Order";
        if (this.props.location.state) {
            console.log("restaurant prop state",this.props.location.state.restaurant);
            this.setState({
                restaurant: this.props.location.state.restaurant,
                cart_items: this.props.location.state.cart_items,
                discount: this.props.location.state.discount,
                delivery: this.props.location.state.delivery,
                tax: this.props.location.state.tax,
                sub_total: this.props.location.state.subTotal,
                total: this.props.location.state.total
            });
            
        }
    };

    getUserProfile = () => {
        axios.get(endPointObj.url + "/profile/customer/getCustomerProfileDetails/" + localStorage.getItem("user_id"))
        .then(response => {
            if(response.data){
                console.log("FE: Customer data response", response.data);
                this.setState({
                    cust_name: response.data.data.cust_name,
                    address: response.data.data.address,
                    phone_number: response.data.data.phone_number
                });
            }
        })
        .catch(error => {
            console.log(error);
        })
    };

    placeOrder = (e) => {
        console.log("Whatsapp:", this.state.restaurant._id);
        console.log("insta:", this.state.restaurant.name);
        let data = {
            user_id: localStorage.getItem("user_id"),
            address: this.state.address,
            phone_number: this.state.phone_number,
            cust_name: this.state.cust_name,
            resto_id: this.state.restaurant.data._id,
            resto_name: this.state.restaurant.data.resto_name,
            order_status: 'ORDER_PLACED',
            sub_total: this.state.sub_total,
            discount: (this.state.discount * this.state.sub_total / 100).toFixed(2),
            delivery: this.state.delivery,
            tax: (this.state.tax * this.state.sub_total / 100).toFixed(2),
            total: this.state.total,
            cart_items: this.state.cart_items,
            order_instruction: this.state.order_instruction
        }
        console.log("cart_items", data.cart_items);
        console.log("placing order", data);
        axios.post(endPointObj.url +"/order/placeorder", data)
            .then(response => {
                console.log("Place order response", response);
                if (response.data) {
                    localStorage.removeItem("cart_items");
                    localStorage.removeItem("cart_res_id");
                    this.setState({
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
        let redirectVar = null,
            order = null,
            message = null;

        if (!localStorage.getItem("user_id") || localStorage.getItem("is_owner") === "1") {
            redirectVar = <Redirect to="/" />
        }
        if (this.state.message === "ORDER_PLACED") {
            redirectVar = <Redirect to="/orders" />
        }
        else if (this.state.message === "ORDER_ERROR") {
            message = <Alert variant="warning">There was some error processing your order!</Alert>
        }
        else if (!localStorage.getItem("cart_items") || localStorage.getItem("cart_items").length === 0) {
            redirectVar = <Redirect to="/cart" />
        }

        if (this.state) {
            order = (
                <div>
                    <Card style={{width: "40rem", height: "35rem"}}>
                        <Card.Title>
                            <br />
                            <h3>{this.state.restaurant.data.resto_name}</h3>
                            {this.state.restaurant.data.address} | {this.state.restaurant.data.zipcode} 
                        </Card.Title>
                        <Card.Body>
                            <Table style={{ width: "90%" }}>
                                <tbody>
                                    <tr>
                                        <td colSpan="4">Your purchase</td>
                                        <td align="center">$ {this.state.sub_total}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4">Tax ({this.state.tax}%)</td>
                                        <td align="center">$ {(this.state.sub_total * this.state.tax / 100).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4">Discounts ({this.state.discount}%)</td>
                                        <td align="center">$ {(this.state.sub_total * this.state.discount / 100).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4">Delivery Charges</td>
                                        <td align="center">$ {this.state.delivery.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4"><b>Total</b></td>
                                        <td align="center"><b>$ {this.state.total}</b></td>
                                    </tr>
                                    <br/>
                                    <tr>
                                        <td colSpan="4">Delivery Address</td>
                                        <td align="center">{this.state.address}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4">Contact Number</td>
                                        <td align="center">{this.state.phone_number}</td>
                                    </tr>
                                  
                                    <tr>
                                        <td colSpan="4">Order Instructions</td>
                                        <td align="center"><input type="text" name="order_instruction" id = "order_instruction" onChange={(e) => this.setState({ order_instruction: e.target.value })}/></td>
                                    
                                    </tr>
                                </tbody>
                            </Table>
                            <center>
                                <Button variant="success" onClick={this.placeOrder}>Confirm Order</Button>&nbsp; &nbsp;
                                <Button variant="secondary" href="/customerHome">Cancel</Button>
                            </center>
                            <br />
                        </Card.Body>
                    </Card>
                    <br /><br /><br />
                    <Button variant="info" href="/cart">Back to Cart</Button>
                </div>
            );
        }

        return (
            <div>
                {redirectVar}
                <Navigationbar /> <br />
                
                    <h3 style = {{ paddingLeft:"25em" }}>Confirm your Order</h3><br/>
                    <center>
                        {message}
                        {order}
                        <br /><br />
                    </center>
               
            </div >
        )
    }
}
export default ConfirmOrder;