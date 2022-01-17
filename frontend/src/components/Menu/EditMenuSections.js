import React, { Component } from "react";
import { Form, Col, Row, Container, Button, Alert } from "react-bootstrap";
import { Redirect } from "react-router";
import endPointObj from '../../endPointUrl.js';
import axios from "axios";

class EditMenuSections extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillMount() {
        let menu_section_id = this.props.location.state.menu_section_id;
        this.setState({
            menu_section_id: menu_section_id
        });
        axios.get(endPointObj.url + '/menu/sectionitem/'+ menu_section_id)
            .then(response => {
                if (response.data.status === "NO_RECORD"){
                    this.setState({
                        noRecordFlag: true
                    });
                }
                else {
                    this.setState({
                        menu_section_name: response.data.menu_section_name
                    });
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
            menu_section_id: this.state.menu_section_id,
            menu_section_name: this.state.menu_section_name
        };

        axios.post(endPointObj.url + '/menu/sectionsupdate', data)
            .then(response => {
                if (response.data) {
                    this.setState({
                        message: response.data
                    });
                }
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
        let message = null,
            menuSectionName = null,
            redirectVar = null;

        if (this.state.message === "SECTION_EXISTS") {
            message = <Alert variant="warning">A section with name {this.state.menu_section_name} already exists</Alert>;
        } else if(this.state.message === "SECTION_UPDATED" || this.state.noRecordFlag) {
            message = <Alert variant="warning">Menu Catoegory updates successfully!</Alert>;
            redirectVar = <Redirect to="/menu/section" />;
        }

        if (this.state && this.state.menu_section_name) {
            menuSectionName = this.state.menu_section_name;
        }

        return (
            <div>
                {redirectVar}
                <Container className="justify-content">
                    <br />
                    <h3>Update Menu Category</h3><br />
                    <Form onSubmit={this.onSubmit}>
                        <Form.Group as={Row} controlId="menu_section_name">
                            <Form.Label column sm="2">
                                Section Name:
                            </Form.Label>
                            <Col sm="6">
                                <Form.Control
                                    style={{ width: "15rem" }}
                                    type="text"
                                    name="menu_section_name"
                                    defaultValue={menuSectionName}
                                    onChange={this.onChange}
                                    pattern="^[A-Za-z ]+$"
                                    required
                                />
                            </Col><br/><br/>
                            <Col sm="4">
                                <Button variant="success" type="sumbit">Update</Button><br/><br/>
                                <Button variant="warning" href="/menu/section">Cancel</Button>
                            </Col>
                        </Form.Group>
                    </Form>
                    {message}
                </Container>
            </div>
        );
    }
}

export default EditMenuSections;