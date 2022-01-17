import React, { Component } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import endPointObj from '../../endPointUrl.js';
import axios from 'axios';


class RestaurantCard extends Component {

  constructor(props) {
    super(props);

    this.state = {
        message:""
    };
    this.onSubmit = this.onSubmit.bind(this);
}

  onSubmit = (e) => {
    e.preventDefault();

    let data = {
      user_id: localStorage.getItem("user_id"),
      resto_id: this.props.restaurant._id
    }

    axios.post(endPointObj.url + '/restaurant/updateFavStatus', data)
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

    if(this.state.message == 'UPDATED_FAV_RESTAURANT') {
      alert("Restaurant added to favourites successfully!");
    }
    console.log(this.props.restaurant.resto_name);
    console.log(this.props.restaurant.resto_description);
    var resData = this.props.restaurant;
    let imageSrc = endPointObj.frontendServer + "/images/restaurant/" + this.props.restaurant.res_image;
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
      <form onSubmit={this.onSubmit}>
        <button type="submit">Add to Favourites</button>
      </form>
      </Card>
    );
  }
}

export default RestaurantCard;