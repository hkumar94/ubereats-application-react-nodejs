import React, { Component } from "react";
import { Form, Col, Row, Button, Alert, Card } from "react-bootstrap";
import { Redirect } from "react-router";
import endPointObj from '../../endPointUrl.js';
import axios from "axios";

class EditMenuItems extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            menu_sections: [],
            item_price: "",
            selected_image: '',
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onImageChange = this.onImageChange.bind(this);
        //this.onUpload = this.onUpload.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.getSections();
    }

    componentWillMount() {
        let item_id = this.state.item_id || this.props.location.state.item_id;
        console.log("Inside edit menu items: item_id", item_id);
        this.setState({
            item_id: item_id
        });
        axios.get(endPointObj.url + '/menu/getMenuItem/' + item_id)
            .then(response => {
                if (response.data.status && response.data.status === "NO_RECORD") {
                    this.setState({
                        noRecordFlag: true
                    });
                }
                else {
                    console.log("Get item response FE", response);
                    console.log("item name", response.data[0].item_name);
                    this.setState({
                        item_id: response.data[0]._id,
                        item_name: response.data[0].item_name,
                        item_description: response.data[0].item_description,
                        item_price: response.data[0].item_price,
                        item_image: response.data[0].item_image,
                        menu_section_id: response.data[0].menu_section_id,
                        menu_section_name: response.data[0].menu_section_name,
                        data_flag: true
                    });
                } 
                console.log("Item name state", this.state.item_name);
                console.log("Item id state", this.state.item_id);
                console.log("Item image state", this.state.item_image);

            })
            .catch(err => {
                if (err.response && err.response.data) {
                    console.log(err.response.data);
                }
            });
    };

    getSections = () => {
        axios.get(endPointObj.url + "/menu/getMenuSections/" + localStorage.getItem("user_id"))
            .then(response => {
                console.log("result FE", response);
                if (response.data) {
                    if (response.data.status === 'NO_RECORD') {
                        this.setState({
                            message: response.data.status
                        });
                    }
                    else {
                        this.setState({
                            menu_sections: response.data
                        });
                    }
                }
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    console.log(err.response.data);
                }
            });
    };

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    onSubmit = e => {
        e.preventDefault();
        const data = {
            user_id: parseInt(localStorage.getItem("user_id")),
            item_id: this.state.item_id,
            item_name: this.state.item_name,
            item_description: this.state.item_description,
            item_price: this.state.item_price,
            menu_section_name: this.state.menu_section_name || this.state.menu_sections[0].menu_section_name,
            item_image: this.state.item_image
        };

        axios.post(endPointObj.url + '/menu/itemsupdate', data)
            .then(response => {
                this.setState({
                    message: response.data.status
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

    onChangeHandler = event => {
        this.setState({
            selected_image: event.target.files[0]
        })
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
    //     axios.post(endPointObj.url + '/menu/uploads/image/' + this.state.item_id, formData, uploadConfig)
    //         .then(response => {
    //             alert("Image uploaded successfully!");
    //             this.setState({
    //                 fileText: "Choose file...",
    //                 item_image: response.data
    //             });
    //         })
    //         .catch(err => {
    //             console.log("Error", err);
    //         });
    // }

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
                    alert('Uploaded Successfully');
                    this.setState({
                        resFileText: "Choose file...",
                        res_image: res.data.imageUrl,
                        message: 'ITEM_IMAGE_UPDATED'
                    });
                }
            });
        this.setState({
            selected_image : ''
        })      
    }

    render() {
        console.log("item price",this.state.item_price);
        let message = null,
            redirectVar = null;

        if (this.state.message === "ITEM_UPDATED") {
            alert("Item updated successfully!");
            redirectVar = <Redirect to="/menu/view" />;
        }
        else if (this.state.message === "ITEM_EXISTS") {
            message = <Alert variant="warning">A item with name {this.state.item_name} already exists</Alert>;
        } else if (this.state.message === "ITEM_IMAGE_UPDATED") {
            redirectVar = <Redirect to="/menu/view" />
        } 

        if (this.state && this.state.noRecordFlag) {
            redirectVar = <Redirect to="/menu/view" />;
        }

        let section_options = null;
        if (this.state && this.state.menu_sections && this.state.menu_sections.length > 0) {
            section_options = this.state.menu_sections.map(menu_section => {
                if (menu_section.menu_section_name === this.state.menu_section_name) {
                    return (
                        <option selected>{menu_section.menu_section_name}</option>
                    );
                }
                return (
                    <option>{menu_section.menu_section_name}</option>
                );
            })
        }

        var imageSrc,
            fileText = this.state.fileText || "Choose image..";
        if (this.state) {
            imageSrc = endPointObj.frontendServer + '/images/item/' + this.state.item_image;
            console.log("Image src", imageSrc);
        }
        return (
            <div className = "restoMenuEditContainer">
                {redirectVar}
                <Row>
                    <Col xs={6} md={4}>
                        <center>
                            <br /><br />
                            <Card style={{ width: '20rem' }}>
                                <Card.Img variant="top" src={imageSrc} />
                            </Card>
                            <form>
                                <br />
                                <input type="file" accept="image/jpg, image/png" name="myImage" onChange={this.onChangeHandler} /> <br />
                                <input type="button" className="my-2" value="Upload" onClick={this.onClickHandler} />
                            </form>
                        </center>
                    </Col>
                    <Col xs={6} md={4}>
                        <center>
                        <br /><br />
                        <h3>Edit Menu Item</h3><br />
                        <Form onSubmit={this.onSubmit}>
                            <Form.Group as={Row} controlId="item_name">
                                <Form.Label column sm="3">
                                    Item Name:
                                </Form.Label>
                                <Col sm="4">
                                    <Form.Control style={{ width: "15rem" }} type="text" name="item_name" value={this.state.item_name} onChange={this.onChange} pattern="^[A-Za-z0-9 ]+$" required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="item_description">
                                <Form.Label column sm="3">
                                    Item Description:
                                </Form.Label>
                                <Col sm="4">
                                    <Form.Control style={{ width: "15rem" }} type="text" name="item_description" placeholder="Enter Item Description.." defaultValue={this.state.item_description} onChange={this.onChange} pattern="^[A-Za-z0-9 ,.-]+$" required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="item_price">
                                <Form.Label column sm="3">Price: </Form.Label>
                                <Col sm="4">
                                    <input style={{ width: "15rem" }} type="text" name="item_price" placeholder="Enter Price.." value={this.state.item_price} onChange={(e) => this.setState({ item_price: e.target.value })} pattern="^(\d*\.)?\d+$" required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="item_section">
                                <Form.Label column sm="3">Section:</Form.Label>
                                <Col sm="4">
                                    <Form.Control as="select" style={{ width: "15rem" }} onChange={this.onChange} name="menu_section_name">
                                        {section_options}
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                            <br/><br/>
                            <Button type="sumbit" className="edit-menu-btn-primary">Update Item</Button>&nbsp;
                            <Button variant="warning" href="/menu/view" className="edit-menu-btn-primary">Cancel</Button>
                        </Form>
                        {message}
                        </center>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default EditMenuItems;