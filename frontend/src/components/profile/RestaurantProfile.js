import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getRestaurant, updateRestaurant } from '../../actions/restaurantProfileActions'
import { Link } from "react-router-dom";
import './RestoProfile.css';
import NavigationBar from '../Navbar/RestaurantNavbarHome.js';
import { Container, Col, Row, Form, Button, ButtonGroup, Card } from 'react-bootstrap';
import axios from 'axios';
import endPointObj from '../../endPointUrl.js';


class RestaurantProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            delivery: false,
            pickup: false,
            selected_image: '',
            profile_pic: '',
        };
        this.onChange = this.onChange.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    componentWillMount() {
        this.props.getRestaurant();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.user) {
            var { user } = nextProps;

            var userData = {
                user_id: localStorage.getItem("user_id"),
                name: user.resto_name || this.state.name,
                description: user.resto_description|| this.state.description,
                email_id: user.email_id || this.state.email_id,
                address: user.address || this.state.address,
                phone_number: user.phone_number || this.state.phone_number,
                timings : user.timings || this.state.timings,
                res_image: user.res_image || this.state.res_image,
                zipcode: user.zipcode || this.state.zipcode,
                delivery: user.delivery || this.state.delivery,
                pickup: user.pickup || this.state.pickup
            };
            console.log("Restaurant Id"+userData.user_id);
            console.log("Restaurant name"+userData.name);
            console.log("Restaurant address"+userData.address);
            console.log("Restaurant phone"+userData.phone_number);
            console.log("delivery:"+userData.delivery);
            console.log("pickup:"+userData.pickup);
            this.setState(userData);
        }
    }

    onChangeHandler = event => {
        this.setState({
            selected_image: event.target.files[0]
        })
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
        console.log("delivery", this.state.delivery);
        console.log("pickup", this.state.pickup);

    }


    onUpdate = (e) => {
        console.log("Updating the restaurant details - frontend");
        //prevent page from refresh
        e.preventDefault();

        let data = Object.assign({}, this.state);
        this.props.updateRestaurant(data);
    };

    // onResUpload = (e) => {
    //     e.preventDefault();
    //     const formData = new FormData();
    //     formData.append("resimage", this.state.res_file);
    //     const uploadConfig = {
    //         headers: {
    //             "content-type": "multipart/form-data"
    //         }
    //     };
    //     axios.post(endPointObj.url + '/profile/restaurant/updateRestaurantProfilePic/' + this.state.user_id, formData, uploadConfig)
    //         .then(response => {
    //             console.log("image response", response.data);
    //             this.setState({
    //                 resFileText: "Choose file...",
    //                 res_image: response.data
    //             });
    //         })
    //         .catch(err => {
    //             console.log("Error");
    //         });
    // }

    onClickHandler = (e) => {
        const data = new FormData()
        data.append('image', this.state.selected_image);
        data.append('id', this.state.user_id);
        axios.post(endPointObj.url + "/profile/restaurant/updateRestaurantProfilePic", data)
            .then(res => { // then print response status
                console.log("img up", res);
                if(res) {
                    console.log("Upload image response data", res.data.imageUrl);
                    alert('Uploaded Successfully');
                    this.setState({
                        resFileText: "Choose file...",
                        res_image: res.data.imageUrl
                    });
                }
            });
        this.setState({
            selected_image : ''
        })      
    }

    render() {
        console.log("delivery", this.state.delivery);
        console.log("pickup", this.state.pickup);
        var resImageSrc, res_title, title,
        resFileText = this.state.resFileText || "Choose image..";

        if (this.state) {
            resImageSrc = endPointObj.frontendServer + '/images/restaurant/' + this.state.res_image;
            res_title = this.state.name;
        }

        return (
            <div className= "profileBackGroundLayer">
                    <div> <NavigationBar /> </div>
                    
                    <div className="restaurantProfileContainer"> 

                    <center>
                                    <Card style={{ width: '20rem' }}>
                                        <Card.Img style={{ width: '20em', height: '20em' }} variant="top" src={resImageSrc} />
                                    </Card>
                                    <br/>
                                    <form>
                                        <br />
                                        <input type="file" accept="image/jpg, image/png" name="myImage" onChange={this.onChangeHandler} /> <br />
                                        <input type="button" className="my-2" value="Upload" onClick={this.onClickHandler} />
                                    </form>
                                    
                                </center>
                  
                        <div className="profileLabel"><b><u>Restaurant Profile Update</u></b></div><br/>
                      
                
                        <Form onSubmit={this.onUpdate} >
                           
                                <Form.Group as={Row} className="mb-3"  controlId="name" >
                                    <Form.Label column sm="3" className="inputLabel"> Restaurant Name</Form.Label>
                                    <Col sm="10">
                                        <Form.Control name="name"
                                            type="text"
                                            onChange={this.onChange}
                                            value={this.state.name}
                                            style={{ width: "80%" }}
                                            pattern="^[A-Za-z0-9 ]+$"
                                            required={true} />
                                    </Col> 
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3" controlId="formGridCity">
                                        <Form.Label column sm="3" className="inputLabel">Description</Form.Label>
                                        <Col sm="10">
                                        <Form.Control type="text"
                                            name="description"
                                            onChange={this.onChange}
                                            value={this.state.description}
                                            style={{ width: "80%" }}
                                            required={true} />
                                        </Col>    
                                    </Form.Group>
                           
                                <Form.Group as={Row} className="mb-3" controlId="email_id">
                                    <Form.Label column sm="3" className="inputLabel">Email</Form.Label>
                                    <Col sm="10">
                                    <Form.Control type="email"
                                        name="email_id"
                                        value={this.state.email_id}
                                        style={{ width: "80%" }}
                                         />
                                    </Col>    
                                </Form.Group>
                          
                                <Form.Group as={Row} className="mb-3" controlId="RB.password">
                                    <Form.Label column sm="3" className="inputLabel">Password</Form.Label>
                                    <Col sm="10">
                                    <Form.Control type="password"
                                        name="password"
                                        onChange={this.onChange}
                                        placeholder="New Password" 
                                        style={{ width: "80%" }}/>
                                    </Col>    
                                </Form.Group>
                           
                                <Form.Group as={Row} className="mb-3" controlId="formGridCity">
                                    <Form.Label column sm="3" className="inputLabel">Address</Form.Label>
                                    <Col sm="10">
                                    <Form.Control type="text"
                                        name="address"
                                        onChange={this.onChange}
                                        value={this.state.address}
                                        style={{ width: "80%" }}
                                        required={true} />
                                    </Col>    
                                </Form.Group>
                            
                                <Form.Group as={Row} className="mb-3" controlId="formGridZipcode">
                                        <Form.Label column sm="3" className="inputLabel">Zipcode</Form.Label>
                                        <Col sm="10">
                                        <Form.Control type="text"
                                            name="zipcode"
                                            onChange={this.onChange}
                                            value={this.state.zipcode}
                                            style={{ width: "80%" }}
                                            />
                                        </Col>    
                                    </Form.Group>
                            
                                <Form.Group as={Row} className="mb-3" controlId="formGridPhone">
                                    <Form.Label column sm="3" className="inputLabel">Phone Number</Form.Label>
                                    <Col sm="10">
                                    <Form.Control type="text"
                                        name="phone_number"
                                        onChange={this.onChange}
                                        value={this.state.phone_number}
                                        required={true}
                                        style={{ width: "80%" }}
                                        pattern="^[0-9]+$"
                                    />
                                    </Col>
                                </Form.Group>
                           
                                <Form.Group as={Row} className="mb-3" controlId="formGridTiming">
                                    <Form.Label column sm="3" className="inputLabel">Timings</Form.Label>
                                    <Col sm="10">
                                    <Form.Control type="textarea"
                                        name="timings"
                                        onChange={this.onChange}
                                        value={this.state.timings}
                                        rows = "30"
                                        cols = "40"
                                        style={{ width: "80%" }}
                                        required={true}
                                    />
                                    </Col>
                                </Form.Group>
                           
                                <Form.Group as={Row} className="mb-3" controlId="formGridDelivery">
                                {/* <Form.Label column sm="3" className="inputLabel">Mode of Delivery</Form.Label>
                                <select name="delivery"  onChange={this.onChange} value={this.state.delivery}>
                                        <option>Mode of Delivery</option>
                                        <option value="D">Delivery</option>
                                        <option value="P" selected>Pickup</option>
                                </select> */}
                                 <Form.Label column sm="3" className="inputLabel"><h4>Mode of delivery:</h4></Form.Label>
                                <input type="checkbox" id="delivery" name="delivery" onChange={(e) => this.setState({delivery: !this.state.delivery})}/>
                                <label for="delivery">Delivery</label>
                                <input type="checkbox" id="pickup" name="pickup" onChange={(e) => this.setState({pickup: !this.state.pickup})} />
                                <label for="pickup">Pickup</label><br/>
                                </Form.Group>
          
                            <div class ="buttonDiv">
                            <ButtonGroup aria-label="Third group">
                                <Button type="submit" variant="success">Update Profile</Button>
                            </ButtonGroup>
                            
                            <ButtonGroup aria-label="Fourth group">
                                <Link to="/restaurantHome"><Button variant="secondary">Cancel</Button></Link>
                            </ButtonGroup>
                            </div>
                        </Form>
                      
                       
                    </div><br/><br/><br/> 
               
            </div>
        )
    }
}

RestaurantProfile.propTypes = {
    getRestaurant: PropTypes.func.isRequired,
    updateRestaurant: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    user: state.restaurantProfile.user
});

export default connect(mapStateToProps, { getRestaurant, updateRestaurant })(RestaurantProfile);