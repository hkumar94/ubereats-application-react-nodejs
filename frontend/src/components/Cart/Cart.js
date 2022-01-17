import React, { Component } from 'react';
import { Redirect } from 'react-router';
import endPointObj from '../../endPointUrl.js';
import { Button, Alert, Container, Table, Card, ListGroup, ListGroupItem} from "react-bootstrap";
import { Link } from "react-router-dom";
import Navigationbar from '../Navbar/CustomerNavbarHome';
import axios from 'axios';
import deleteIcon from "../../assets/icons/delete.jpg";
import cartIcon from "../../assets/cartPageImage.jpg";
import "./cart.css";

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cart_items: [],
            restaurant: '',
            item_quantity: ''
        };
        this.clearCart = this.clearCart.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.getRestaurantDetails();
    }

    componentWillMount() {        
        document.title = "Your Cart";
        let cartItems = [];
        //  if (localStorage.getItem("cart_items")) {
        //     cartItems.push(...JSON.parse(localStorage.getItem("cart_items")));
            
        //     this.setState({
        //         cart_items: cartItems
        //     });
        //     console.log("cart items:",this.state.cart_items);
        // } 
        //else {
        let user_id = localStorage.getItem("user_id");
        axios.get(endPointObj.url + "/cart/getcartitems/" + user_id)
            .then(response => {
                console.log("In the cart: get menu items FE:", response);
                if (response) {
                    this.setState({
                        cart_items: response.data
                    });
                }
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    console.log(err.response.data);
                }
            });
        //}
    };

    getRestaurantDetails = () => {
        let res_id;
        if (localStorage.getItem("cart_res_id")) {
            res_id = localStorage.getItem("cart_res_id");
            
            axios.get(endPointObj.url + "/restaurant/getRestaurantProfileDetails/" + res_id)
                .then(response => {
                    if (response.data) {
                        console.log("hiiiiiiiiiiiiiresponse", response.data);
                        this.setState({
                            restaurant: response.data
                        });
                    }
                })
                .catch(error => {
                    if (error.response && error.response.data) {
                        console.log(error.response.data);
                    }
                })
        }
    };

    onQuantityChange = (e) => {
        let item_id = e.target.name;
        console.log("id",item_id);
        let newQuantity = parseInt(e.target.value);
        console.log("quantity", newQuantity);
        let cart_items = this.state.cart_items;
        console.log("INNNNN", cart_items);
        let index = cart_items.findIndex((cart_item => cart_item.item_id === item_id));
        cart_items[index].item_quantity = newQuantity;
        this.setState({
            cart_items: cart_items
        });
        localStorage.setItem("cart_items", JSON.stringify(cart_items));
    };

    removeItem = (e) => {
        console.log("Inside remove cart item");
        let item_id = parseInt(e.target.name);
        let cart_items = this.state.cart_items;
        
        let data = {
            item_id: e.target.name,
            user_id: localStorage.getItem("user_id")
        }
        axios.post(endPointObj.url + "/cart/cartItemdelete", data)
                .then(response => {
                    let index = cart_items.findIndex((cart_item => cart_item.item_id === item_id));
                    cart_items.splice(index, 1);
                    this.setState({
                        cart_items: cart_items,
                        message: response.data
                    });
                    localStorage.setItem("cart_items", JSON.stringify(cart_items));
                })
                .catch(error => {
                    if (error.response && error.response.data) {
                        console.log(error.response.data);
                    }
                })
        
    }

    calculateSubTotal = () => {
        let cart_items = this.state.cart_items;
        let subTotal = 0;
        for (var i = 0; i < cart_items.length; i++) {
            for (var j = 0; j < cart_items.length; j++) {
                if (cart_items[i].item_id === cart_items[j].item_id) {
                    subTotal += (cart_items[i].item_quantity * cart_items[j].item_price);
                }
            }
        }
        subTotal = subTotal.toFixed(2);
        return subTotal;
    };

    clearCart = () => {
        localStorage.removeItem("cart_items");
        this.setState({
            cart_items: []
        });
    };

    render() {
        console.log("In page cart items", this.state.cart_items);
        console.log("res state", this.state.restaurant);
        let redirectVar = null,
            itemsRender = [],
            message = null,
            resName, resAddress, resZIP, restaurantDetails = null, discountAmount = null, deliveryAmount = null;

        let discount = 0,
            delivery = 3.25,
            tax = 2.50;

        if (!localStorage.getItem("user_id")) {
            redirectVar = <Redirect to="/customerLogin" />
        }

        if (this.state && this.state.restaurant) {
            resName = this.state.restaurant.data.resto_name;
            resAddress = this.state.restaurant.data.address;
            resZIP = this.state.restaurant.zipcode;
        }

        if (this.state && this.state.cart_items.length === 0) {
            message =
                [<center><Alert variant="warning">You haven't added any items to your cart. Please add the items to cart you want to buy.</Alert><br />
                    <Button href="/Customerhome"><b>Go to Home</b></Button></center>
                ]
        }
        else {
            restaurantDetails = (
                <Card style={{ width: "20rem", margin: "1%" }}>
                    <ListGroup>
                        <ListGroupItem><h3>{resName}</h3></ListGroupItem>
                        <ListGroupItem>{resAddress} | {resZIP}</ListGroupItem>
                    </ListGroup>
                </Card>
            );
            let cart_items = this.state.cart_items;
            var subTotal = this.calculateSubTotal(cart_items);
            if (subTotal < 100) {
                discount = 0;
                deliveryAmount = (
                    <tr>
                        <td colSpan="4">Delivery Charges</td>
                        <td align="center">$ {delivery.toFixed(2)}</td>
                    </tr>
                );
            }
            else {
                delivery = 0;
                discountAmount = (<tr>
                    <td colSpan="4">Discounts ({discount}%)</td>
                    <td align="center">$ {(subTotal * discount / 100).toFixed(2)}</td>
                </tr>);
            }
            var total = ((subTotal * (100 + tax - discount) / 100) + delivery).toFixed(2);
            for (var i = 0; i < cart_items.length; i++) {
                let item = (
                    <tr>
                        <td align="center">{cart_items[i].item_name}</td>
                        <td align="center">$ {cart_items[i].item_price}</td>
                        <td align="center">
                            <input type="number" name={cart_items[i].item_id} min="1" max="10" width="10%" onChange={this.onQuantityChange} defaultValue={cart_items[i].item_quantity}></input>
                        </td>
                        <td align="center">
                            <Button variant="link" name={cart_items[i].item_id}>
                                <img src={deleteIcon} width="15" name={cart_items[i].item_id} onClick={this.removeItem} alt="" />
                            </Button>
                        </td>
                        <td align="center">$ {cart_items[i].item_price * cart_items[i].item_quantity}</td>
                    </tr>
                );
                itemsRender.push(item);
            }
            var 
            confirmDetails = {restaurant: this.state.restaurant, subTotal: subTotal, delivery: delivery, discount: discount, tax: tax, total: total, cart_items: this.state.cart_items};
            var cartTable = (
                <div>
                    <Table style={{ width: "90%" }}>
                        <thead align="center">
                            <th>Item Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th></th>
                            <th>Total Price</th>
                        </thead>
                        <tbody>
                            {itemsRender}
                            <br /><br /><br /><br />
                            <tr>
                                <td colSpan="4"><b>Sub Total</b></td>
                                <td align="center"><b>$ {subTotal}</b></td>
                            </tr>
                            <tr>
                                <td colSpan="4">Tax ({tax}%)</td>
                                <td align="center">$ {(subTotal * tax / 100).toFixed(2)}</td>
                            </tr>
                            {discountAmount}
                            {deliveryAmount}
                            <tr>
                                <td colSpan="4"><b>Total</b></td>
                                <td align="center"><b>$ {total}</b></td>
                            </tr>
                        </tbody>
                    </Table>
                    <Button variant="warning" onClick={this.clearCart}>Clear Cart</Button> &nbsp; &nbsp;
                    
                    <Link to={{pathname: "/order/confirm", state: confirmDetails}}>
                        <Button variant="success">Proceed to Checkout</Button>
                    </Link>
                </div>
            );
        }

        return (
            <div>
                {redirectVar}
                <Navigationbar /><br />
                <table>
                    <tr>
                        <td>&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;</td> &nbsp; &nbsp; &nbsp;
                        <td> &nbsp; &nbsp; &nbsp;</td>&nbsp; &nbsp; &nbsp;
                        <td> &nbsp; &nbsp; &nbsp;</td>&nbsp; &nbsp; &nbsp;
                        <td>
                            <Container className="cartContainer">
                                <h3>Your Cart</h3><br />
                                <center>
                                    {message}
                                    {cartTable}
                                    <br /><br />
                                </center>
                            </Container>
                        </td>
                    </tr>
                </table>

            </div>
        )
    }
}
export default Cart;