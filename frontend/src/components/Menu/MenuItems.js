import React, { Component } from "react";
import { Form, Col, Row, Button, Alert, Card } from "react-bootstrap";
import { Redirect } from "react-router";
import axios from "axios";
import endPointObj from '../../endPointUrl.js';
import "./Menu.css";

class MenuItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu_sections: [],
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onImageChange = this.onImageChange.bind(this);
        //this.onUpload = this.onUpload.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.getSections();
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    getSections = () => {
        axios.get(endPointObj.url + "/menu/getMenuSections/" + localStorage.getItem("user_id"))
            .then(response => {
                if (response.data[0]) {
                    this.setState({
                        menu_sections: response.data
                    });
                }
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    console.log(err.response.data);
                }
            });
    };

    onSubmit = e => {
        e.preventDefault();
        const data = {
            resto_id: localStorage.getItem("user_id"),
            item_name: this.state.item_name,
            item_description: this.state.item_description,
            item_price: this.state.item_price,
            item_category: this.state.menu_section_name || this.state.menu_sections[0].menu_section_name,
            item_image: this.state.item_image
        };

        axios.post(endPointObj.url + "/menu/addMenu", data)
            .then(response => {
                console.log("Add menu response", response.data);
                this.setState({
                    item_id: response.data._id,
                    message: 'MENU_ADDED'
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

    onImageChange = (e) => {
        this.setState({
            file: e.target.files[0],
            fileText: e.target.files[0].name
        });
    }

    // onUpload = (e) => {
    //     e.preventDefault();
    //     const formData = new FormData();
    //     formData.append("itemimage", this.state.file);
    //     const uploadConfig = {
    //         headers: {
    //             "content-type": "multipart/form-data"
    //         }
    //     };
    //     axios.post(endPointObj.url + "menu/uploads/image/" + this.state.item_id, formData, uploadConfig)
    //         .then(response => {
    //             alert("Image uploaded successfully!");
    //             this.setState({
    //                 fileText: "Choose file...",
    //                 item_image: response.data
    //             });
    //         })
    //         .catch(err => {
    //             console.log("Error");
    //         });
    // }

    onChangeHandler = event => {
        this.setState({
            selected_image: event.target.files[0]
        })
    }

    onClickHandler = (e) => {
        console.log("Uploading imageee");
        const data = new FormData()
        data.append('image', this.state.selected_image);
        data.append('id', this.state.item_id);
        axios.post(endPointObj.url + "/menu/uploads/image", data)
            .then(res => { // then print response status
                console.log("img up", res);
                if(res) {
                    console.log("Upload image response data", res.data.imageUrl);
                    alert("Image uploaded successfully!");
                    this.setState({
                        resFileText: "Choose file...",
                        item_image: res.data.imageUrl
                    });
                }
            });
        this.setState({
            selected_image : ''
        })      
    }

    render() {
        console.log("Item id", this.state.item_id);
        let message = null, redirectVar= null;
        if (this.state.message === "MENU_ADDED") {
            //redirectVar = <Redirect to="/menu/view" />;
        }
        else if (this.state.message === "ITEM_EXISTS") {
            message = <Alert variant="warning">A item with name {this.state.item_name} already exists</Alert>;
        }

        let section_options = null;
        if (this.state && this.state.menu_sections && this.state.menu_sections.length > 0) {
            section_options = this.state.menu_sections.map(menu_section => {
                return (
                    <option>{menu_section.menu_section_name}</option>
                );
            })
        }

        var imageSrc,
            fileText = this.state.fileText || "Choose image..";
        if (this.state) {
            imageSrc = this.state.item_image;
        }
        return (
            <div className = "restoMenuEditContainer">
                {redirectVar}
                <Row>
                    <Col xs={6} md={4}>
                        <center>
                            <br/><br/>
                            <h3>Upload Menu Item Image</h3><br />
                            <Card style={{ width: '10rem', height: '8rem' }}>
                                <Card.Img variant="top" style={{ width: '10rem', height: '8rem' }} src={imageSrc} />
                            </Card><br/><br/>
                            <form>
                                        <br />
                                        <input type="file" accept="image/jpg, image/png" name="myImage" onChange={this.onChangeHandler} /> <br />
                                        <input type="button" className="my-2" value="Upload" onClick={this.onClickHandler} />
                                    </form>
                        </center>
                    </Col>
             
                    <Col xs={6} md={4}>
                        <center>
                        <br/><br/>
                        <h3>Add New Menu Item</h3><br />
                        <Form onSubmit={this.onSubmit}>
                            <Form.Group as={Row} controlId="item_name">
                                <Form.Label column sm="3">
                                    Item Name:
                                </Form.Label>
                                <Col sm="4">
                                    <Form.Control style={{ width: "15rem" }} type="text" name="item_name" placeholder="Enter Item Name.." onChange={this.onChange} pattern="^[A-Za-z0-9 ]+$" required/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="item_description">
                                <Form.Label column sm="3">
                                    Item Description:
                                </Form.Label>
                                <Col sm="4">
                                    <Form.Control style={{ width: "15rem" }} type="text" name="item_description" placeholder="Enter Item Description.." onChange={this.onChange} pattern="^[A-Za-z0-9 ,.-]+$" required/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="item_price">
                                <Form.Label column sm="3">Price: </Form.Label>
                                <Col sm="4">
                                    <Form.Control style={{ width: "15rem" }} type="text" name="item_price" placeholder="Enter Price.." onChange={this.onChange} pattern="^(\d*\.)?\d+$" required/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="item_section">
                                <Form.Label column sm="3">Section:</Form.Label>
                                <Col sm="4">
                                    <Form.Control as="select" style={{ width: "15rem" }} onChange={this.onChange} name="menu_section_name" required>
                                        {section_options}
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                            <Button type="sumbit" className="edit-menu-btn-primary">Add Item</Button>
                        </Form>
                        {message}
                        </center>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default MenuItems;