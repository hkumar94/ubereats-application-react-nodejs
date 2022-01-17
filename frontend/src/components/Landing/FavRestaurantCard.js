import React, { Component } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import endPointObj from '../../endPointUrl.js';
import axios from 'axios';


class FavRestaurantCard extends Component {

  render() {

    console.log(this.props.restaurant.resto_name);
    console.log(this.props.restaurant.resto_description);
    var resData = this.props.restaurant;
    let imageSrc = endPointObj.url + "/images/restaurant/" + this.props.restaurant.res_image;
    return (
      <Card bg="white" style={{ width: "20rem", margin: "5%" }}>
      <Link to={{pathname: '/restaurant', state: resData}}>
      <Card bg="white" style={{ width: "18rem", margin: "5%" }}>
        
        <Card.Body>
          <Card.Title style={{ fontSize: "2rem", margin: "5%", color: "#1d6e04" }}><b>{this.props.restaurant.resto_name}</b></Card.Title>
          <Card.Img
          style={{ width: "15rem", height: "10em", margin: "5%" }}
          src={imageSrc}
        />
          <Card.Text>{this.props.restaurant.resto_description}</Card.Text>
        </Card.Body>
      </Card>
      </Link>
      </Card>
    );
  }
}

export default FavRestaurantCard;