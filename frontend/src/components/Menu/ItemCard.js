import React, { Component } from "react";
import { Card, Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import endPointObj from '../../endPointUrl.js';
import "./Menu.css";

class ItemCard extends Component {
  render() {
    console.log("Inside Itemcard", this.props.menu_item._id);
    let imageSrc = endPointObj.frontendServer + "/images/item/" + this.props.menu_item.item_image;
    return (
        <div>
        <Card bg="white" style={{ width: "50rem", margin: "5%" }}>
          <Row>
            <Col>
              <Card.Img style={{ width: "20rem", height: "10rem" }} src={imageSrc} />
            </Col>
            <Col align="left">
              <Card.Body>
                <Card.Title style={{ width: "20rem", fontSize: "1em"}}><b><u>{this.props.menu_item.item_name}</u></b></Card.Title>
                <Card.Text style={{ width: "10rem" }}style={{ width: "20rem" }}><p><i>{this.props.menu_item.item_description}</i></p></Card.Text>
                <Card.Text>Price: $ {this.props.menu_item.item_price}</Card.Text>
              </Card.Body>
            </Col>
            <Col align="left">
              <Link to={{ pathname: "/menu/item/update", state: { item_id: this.props.menu_item._id } }}>   
                <Button variant="link" name={this.props.menu_item._id} className="edit-menu-btn-primary">Edit</Button>&nbsp;
                </Link>
                <Button variant="link" onClick={this.props.deleteItem} name={this.props.menu_item._id} className="edit-menu-btn-primary">Delete</Button>    
            </Col>
          </Row>
        </Card>
        <br/>
        </div>
    );
  }
}

export default ItemCard;