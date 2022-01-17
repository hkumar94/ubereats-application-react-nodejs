import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCustomer, updateCustomer } from '../../actions/customerProfileActions'
import { Link } from "react-router-dom";
import './CustProfile.css';
import NavigationBar from '../Navbar/CustomerNavbarHome.js';
import { Container, Col, Row, Form, Button, ButtonGroup, Card } from 'react-bootstrap';
import axios from 'axios';
import endPointObj from '../../endPointUrl.js';


class CustomerProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected_image: '',
            profile_pic: ''
        };
        this.onChange = this.onChange.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    componentWillMount() {
        this.props.getCustomer();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.user) {
            var { user } = nextProps;

            var userData = {
                user_id: user.user_id || this.state.user_id|| localStorage.getItem("user_id"),
                name: user.cust_name || this.state.name,
                email_id: user.email_id || this.state.email_id,
                address: user.address || this.state.address,
                phone_number: user.phone_number || this.state.phone_number,
                country: user.country || this.state.country,
                dob: user.dob || this.state.dob,
                user_image: user.cust_img || this.state.user_image

            };
            console.log("User id", userData.user_id);
            console.log("Userdata name"+userData.name);
            console.log("Userdata address"+userData.address);
            console.log("Userdata phone"+userData.phone_number);
            console.log("Userdata country"+this.state.country);
            console.log("Userdata dob"+this.state.dob);
            this.setState(userData);
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    
    onImageChange = (e) => {
        this.setState({
            file: e.target.files[0],
            fileText: e.target.files[0].name
        });
    }

    // onUpload = (e) => {
    //     e.preventDefault();
    //     const formData = new FormData();
    //     formData.append("image", this.state.file);
    //     const uploadConfig = {
    //         headers: {
    //             "content-type": "multipart/form-data"
    //         }
    //     };
    //     axios.post(endPointObj.url + "/uploads/user/" + this.state.user_id, formData, uploadConfig)
    //         .then(response => {
    //             console.log("image response", response.data);

    //             this.setState({
    //                 fileText: "Choose file...",
    //                 user_image: response.data
    //             });
    //         })
    //         .catch(err => {
    //             console.log("Error");
    //         });
    //         console.log("USEr image response", this.state.user_image)
    // }

    onChangeHandler = event => {
        this.setState({
            selected_image: event.target.files[0]
        })
    }

    onClickHandler = (e) => {
        const data = new FormData()
        data.append('image', this.state.selected_image);
        data.append('id', this.state.user_id);
        axios.post(endPointObj.url + "/profile/customer/updateCustomerProfilePic", data)
            .then(res => { // then print response status
                console.log("img up", res);
                if(res) {
                    console.log("Upload image response data", res.data.imageUrl);
                    alert('Uploaded Successfully');
                    this.setState({
                        resFileText: "Choose file...",
                        user_image: res.data.imageUrl
                    });
                }
            });
        this.setState({
            selected_image : ''
        })      
    }

    onUpdate = (e) => {
        console.log("Updating the customer details - frontend");
        //prevent page from refresh
        e.preventDefault();

        let data = Object.assign({}, this.state);
        this.props.updateCustomer(data);
    };

    render() {
        var imageSrc,
        fileText = this.state.fileText || "Choose image..",
        title = this.state.name;
        if (this.state) {
            imageSrc = endPointObj.frontendServer + '/images/customer/' + this.state.user_image;
        }
        console.log("Image url", imageSrc);
        return (
            <div className= "profileBackGroundLayer">
                    <div> <NavigationBar /> </div>
                    <br/><br/>
                    <div className="profileContainer"> 
                    <center>
                                <Card style={{ width: '18rem' }}>
                                    <Card.Img variant="top" src={imageSrc} />
                                   
                                </Card>
                                <form>
                                        <br />
                                        <input type="file" accept="image/jpg, image/png" name="myImage" onChange={this.onChangeHandler} /> <br />
                                        <input type="button" className="my-2" value="Upload" onClick={this.onClickHandler} />
                                    </form>
                            </center>
                  
                        <div className="profileLabel"><b><u>Profile Update</u></b></div><br/>
                      
                
                        <Form onSubmit={this.onUpdate} >
                           
                                <Form.Group as={Row} className="mb-3"  controlId="name">
                                    <Form.Label column sm="3" className="inputLabel">Name</Form.Label>
                                    <Col sm="10">
                                        <Form.Control name="name"
                                            style={{ width: '90%'}}
                                            type="text"
                                            onChange={this.onChange}
                                            value={this.state.name}
                                            pattern="^[A-Za-z0-9 ]+$"
                                            required={true} />
                                    </Col> 
                                </Form.Group>
                          
                         
                                <Form.Group as={Row} className="mb-3" controlId="email_id">
                                    <Form.Label column sm="3" className="inputLabel">Email</Form.Label>
                                    <Col sm="10">
                                    <Form.Control type="email"
                                       style={{ width: '90%'}}
                                        name="email_id"
                                        value={this.state.email_id}/>
                                    </Col>    
                                </Form.Group>
                        
                           
                                <Form.Group as={Row} className="mb-3" controlId="RB.password">
                                    <Form.Label column sm="3" className="inputLabel">Password</Form.Label>
                                    <Col sm="10">
                                    <Form.Control type="password"
                                        name="password"
                                        style={{ width: '90%'}}
                                        onChange={this.onChange}
                                        placeholder="New Password" />
                                    </Col>    
                                </Form.Group>
                            
                        
                                <Form.Group as={Row} className="mb-3" controlId="RB.password">
                                        <Form.Label column sm="3" className="inputLabel">Date Of Birth</Form.Label>
                                        <Col sm="10">
                                        <Form.Control type="date"
                                            name="dob"
                                            style={{ width: '90%'}}
                                            value={this.state.dob}
                                            onChange={this.onChange}
                                             />
                                        </Col>    
                                    </Form.Group>
                           
                                <Form.Group as={Row} className="mb-3" controlId="formGridCity">
                                    <Form.Label column sm="3" className="inputLabel">Address</Form.Label>
                                    <Col sm="10">
                                    <Form.Control type="text"
                                        name="address"
                                        style={{ width: '90%'}}
                                        onChange={this.onChange}
                                        value={this.state.address}
                                        pattern="^[A-Za-z0-9 ,-]+$"
                                        required={true} />
                                    </Col>    
                                </Form.Group>
                           
                       
                            <Form.Group as={Row} className="mb-3" controlId="formGridCountry">
                            <Form.Label column sm="3" className="inputLabel">Country</Form.Label><br />
                            <select name="country"  onChange={this.onChange} value={this.state.country}>
                                    <option>select country</option>
                                    <option value="AF">Afghanistan</option>
                                    <option value="AX">Aland Islands</option>
                                    <option value="AL">Albania</option>
                                    <option value="DZ">Algeria</option>
                                    <option value="AS">American Samoa</option>
                                    <option value="AD">Andorra</option>
                                    <option value="AO">Angola</option>
                                    <option value="AI">Anguilla</option>
                                    <option value="AQ">Antarctica</option>
                                    <option value="AG">Antigua and Barbuda</option>
                                    <option value="AR">Argentina</option>
                                    <option value="AM">Armenia</option>
                                    <option value="AW">Aruba</option>
                                    <option value="AU">Australia</option>
                                    <option value="AT">Austria</option>
                                    <option value="AZ">Azerbaijan</option>
                                    <option value="BS">Bahamas</option>
                                    <option value="BH">Bahrain</option>
                                    <option value="BD">Bangladesh</option>
                                    <option value="BB">Barbados</option>
                                    <option value="BY">Belarus</option>
                                    <option value="BE">Belgium</option>
                                    <option value="BZ">Belize</option>
                                    <option value="BJ">Benin</option>
                                    <option value="BM">Bermuda</option>
                                    <option value="BT">Bhutan</option>
                                    <option value="BO">Bolivia</option>
                                    <option value="BQ">Bonaire, Sint Eustatius and Saba</option>
                                    <option value="BA">Bosnia and Herzegovina</option>
                                    <option value="BW">Botswana</option>
                                    <option value="BV">Bouvet Island</option>
                                    <option value="BR">Brazil</option>
                                    <option value="IO">British Indian Ocean Territory</option>
                                    <option value="BN">Brunei Darussalam</option>
                                    <option value="BG">Bulgaria</option>
                                    <option value="BF">Burkina Faso</option>
                                    <option value="BI">Burundi</option>
                                    <option value="KH">Cambodia</option>
                                    <option value="CM">Cameroon</option>
                                    <option value="CA">Canada</option>
                                    <option value="CV">Cape Verde</option>
                                    <option value="KY">Cayman Islands</option>
                                    <option value="CF">Central African Republic</option>
                                    <option value="TD">Chad</option>
                                    <option value="CL">Chile</option>
                                    <option value="CN">China</option>
                                    <option value="CX">Christmas Island</option>
                                    <option value="CC">Cocos (Keeling) Islands</option>
                                    <option value="CO">Colombia</option>
                                    <option value="KM">Comoros</option>
                                    <option value="CG">Congo</option>
                                    <option value="CD">Congo, Democratic Republic of the Congo</option>
                                    <option value="CK">Cook Islands</option>
                                    <option value="CR">Costa Rica</option>
                                    <option value="CI">Cote D'Ivoire</option>
                                    <option value="HR">Croatia</option>
                                    <option value="CU">Cuba</option>
                                    <option value="CW">Curacao</option>
                                    <option value="CY">Cyprus</option>
                                    <option value="CZ">Czech Republic</option>
                                    <option value="DK">Denmark</option>
                                    <option value="DJ">Djibouti</option>
                                    <option value="DM">Dominica</option>
                                    <option value="DO">Dominican Republic</option>
                                    <option value="EC">Ecuador</option>
                                    <option value="EG">Egypt</option>
                                    <option value="SV">El Salvador</option>
                                    <option value="GQ">Equatorial Guinea</option>
                                    <option value="ER">Eritrea</option>
                                    <option value="EE">Estonia</option>
                                    <option value="ET">Ethiopia</option>
                                    <option value="FK">Falkland Islands (Malvinas)</option>
                                    <option value="FO">Faroe Islands</option>
                                    <option value="FJ">Fiji</option>
                                    <option value="FI">Finland</option>
                                    <option value="FR">France</option>
                                    <option value="GF">French Guiana</option>
                                    <option value="PF">French Polynesia</option>
                                    <option value="TF">French Southern Territories</option>
                                    <option value="GA">Gabon</option>
                                    <option value="GM">Gambia</option>
                                    <option value="GE">Georgia</option>
                                    <option value="DE">Germany</option>
                                    <option value="GH">Ghana</option>
                                    <option value="GI">Gibraltar</option>
                                    <option value="GR">Greece</option>
                                    <option value="GL">Greenland</option>
                                    <option value="GD">Grenada</option>
                                    <option value="GP">Guadeloupe</option>
                                    <option value="GU">Guam</option>
                                    <option value="GT">Guatemala</option>
                                    <option value="GG">Guernsey</option>
                                    <option value="GN">Guinea</option>
                                    <option value="GW">Guinea-Bissau</option>
                                    <option value="GY">Guyana</option>
                                    <option value="HT">Haiti</option>
                                    <option value="HM">Heard Island and Mcdonald Islands</option>
                                    <option value="VA">Holy See (Vatican City State)</option>
                                    <option value="HN">Honduras</option>
                                    <option value="HK">Hong Kong</option>
                                    <option value="HU">Hungary</option>
                                    <option value="IS">Iceland</option>
                                    <option value="IN">India</option>
                                    <option value="ID">Indonesia</option>
                                    <option value="IR">Iran, Islamic Republic of</option>
                                    <option value="IQ">Iraq</option>
                                    <option value="IE">Ireland</option>
                                    <option value="IM">Isle of Man</option>
                                    <option value="IL">Israel</option>
                                    <option value="IT">Italy</option>
                                    <option value="JM">Jamaica</option>
                                    <option value="JP">Japan</option>
                                    <option value="JE">Jersey</option>
                                    <option value="JO">Jordan</option>
                                    <option value="KZ">Kazakhstan</option>
                                    <option value="KE">Kenya</option>
                                    <option value="KI">Kiribati</option>
                                    <option value="KP">Korea, Democratic People's Republic of</option>
                                    <option value="KR">Korea, Republic of</option>
                                    <option value="XK">Kosovo</option>
                                    <option value="KW">Kuwait</option>
                                    <option value="KG">Kyrgyzstan</option>
                                    <option value="LA">Lao People's Democratic Republic</option>
                                    <option value="LV">Latvia</option>
                                    <option value="LB">Lebanon</option>
                                    <option value="LS">Lesotho</option>
                                    <option value="LR">Liberia</option>
                                    <option value="LY">Libyan Arab Jamahiriya</option>
                                    <option value="LI">Liechtenstein</option>
                                    <option value="LT">Lithuania</option>
                                    <option value="LU">Luxembourg</option>
                                    <option value="MO">Macao</option>
                                    <option value="MK">Macedonia, the Former Yugoslav Republic of</option>
                                    <option value="MG">Madagascar</option>
                                    <option value="MW">Malawi</option>
                                    <option value="MY">Malaysia</option>
                                    <option value="MV">Maldives</option>
                                    <option value="ML">Mali</option>
                                    <option value="MT">Malta</option>
                                    <option value="MH">Marshall Islands</option>
                                    <option value="MQ">Martinique</option>
                                    <option value="MR">Mauritania</option>
                                    <option value="MU">Mauritius</option>
                                    <option value="YT">Mayotte</option>
                                    <option value="MX">Mexico</option>
                                    <option value="FM">Micronesia, Federated States of</option>
                                    <option value="MD">Moldova, Republic of</option>
                                    <option value="MC">Monaco</option>
                                    <option value="MN">Mongolia</option>
                                    <option value="ME">Montenegro</option>
                                    <option value="MS">Montserrat</option>
                                    <option value="MA">Morocco</option>
                                    <option value="MZ">Mozambique</option>
                                    <option value="MM">Myanmar</option>
                                    <option value="NA">Namibia</option>
                                    <option value="NR">Nauru</option>
                                    <option value="NP">Nepal</option>
                                    <option value="NL">Netherlands</option>
                                    <option value="AN">Netherlands Antilles</option>
                                    <option value="NC">New Caledonia</option>
                                    <option value="NZ">New Zealand</option>
                                    <option value="NI">Nicaragua</option>
                                    <option value="NE">Niger</option>
                                    <option value="NG">Nigeria</option>
                                    <option value="NU">Niue</option>
                                    <option value="NF">Norfolk Island</option>
                                    <option value="MP">Northern Mariana Islands</option>
                                    <option value="NO">Norway</option>
                                    <option value="OM">Oman</option>
                                    <option value="PK">Pakistan</option>
                                    <option value="PW">Palau</option>
                                    <option value="PS">Palestinian Territory, Occupied</option>
                                    <option value="PA">Panama</option>
                                    <option value="PG">Papua New Guinea</option>
                                    <option value="PY">Paraguay</option>
                                    <option value="PE">Peru</option>
                                    <option value="PH">Philippines</option>
                                    <option value="PN">Pitcairn</option>
                                    <option value="PL">Poland</option>
                                    <option value="PT">Portugal</option>
                                    <option value="PR">Puerto Rico</option>
                                    <option value="QA">Qatar</option>
                                    <option value="RE">Reunion</option>
                                    <option value="RO">Romania</option>
                                    <option value="RU">Russian Federation</option>
                                    <option value="RW">Rwanda</option>
                                    <option value="BL">Saint Barthelemy</option>
                                    <option value="SH">Saint Helena</option>
                                    <option value="KN">Saint Kitts and Nevis</option>
                                    <option value="LC">Saint Lucia</option>
                                    <option value="MF">Saint Martin</option>
                                    <option value="PM">Saint Pierre and Miquelon</option>
                                    <option value="VC">Saint Vincent and the Grenadines</option>
                                    <option value="WS">Samoa</option>
                                    <option value="SM">San Marino</option>
                                    <option value="ST">Sao Tome and Principe</option>
                                    <option value="SA">Saudi Arabia</option>
                                    <option value="SN">Senegal</option>
                                    <option value="RS">Serbia</option>
                                    <option value="CS">Serbia and Montenegro</option>
                                    <option value="SC">Seychelles</option>
                                    <option value="SL">Sierra Leone</option>
                                    <option value="SG">Singapore</option>
                                    <option value="SX">Sint Maarten</option>
                                    <option value="SK">Slovakia</option>
                                    <option value="SI">Slovenia</option>
                                    <option value="SB">Solomon Islands</option>
                                    <option value="SO">Somalia</option>
                                    <option value="ZA">South Africa</option>
                                    <option value="GS">South Georgia and the South Sandwich Islands</option>
                                    <option value="SS">South Sudan</option>
                                    <option value="ES">Spain</option>
                                    <option value="LK">Sri Lanka</option>
                                    <option value="SD">Sudan</option>
                                    <option value="SR">Suriname</option>
                                    <option value="SJ">Svalbard and Jan Mayen</option>
                                    <option value="SZ">Swaziland</option>
                                    <option value="SE">Sweden</option>
                                    <option value="CH">Switzerland</option>
                                    <option value="SY">Syrian Arab Republic</option>
                                    <option value="TW">Taiwan, Province of China</option>
                                    <option value="TJ">Tajikistan</option>
                                    <option value="TZ">Tanzania, United Republic of</option>
                                    <option value="TH">Thailand</option>
                                    <option value="TL">Timor-Leste</option>
                                    <option value="TG">Togo</option>
                                    <option value="TK">Tokelau</option>
                                    <option value="TO">Tonga</option>
                                    <option value="TT">Trinidad and Tobago</option>
                                    <option value="TN">Tunisia</option>
                                    <option value="TR">Turkey</option>
                                    <option value="TM">Turkmenistan</option>
                                    <option value="TC">Turks and Caicos Islands</option>
                                    <option value="TV">Tuvalu</option>
                                    <option value="UG">Uganda</option>
                                    <option value="UA">Ukraine</option>
                                    <option value="AE">United Arab Emirates</option>
                                    <option value="GB">United Kingdom</option>
                                    <option value="US">United States</option>
                                    <option value="UM">United States Minor Outlying Islands</option>
                                    <option value="UY">Uruguay</option>
                                    <option value="UZ">Uzbekistan</option>
                                    <option value="VU">Vanuatu</option>
                                    <option value="VE">Venezuela</option>
                                    <option value="VN">Viet Nam</option>
                                    <option value="VG">Virgin Islands, British</option>
                                    <option value="VI">Virgin Islands, U.s.</option>
                                    <option value="WF">Wallis and Futuna</option>
                                    <option value="EH">Western Sahara</option>
                                    <option value="YE">Yemen</option>
                                    <option value="ZM">Zambia</option>
                                    <option value="ZW">Zimbabwe</option>
                                </select>
                            </Form.Group>
                                
                            
                                <Form.Group as={Row} className="mb-3" controlId="formGridZip">
                                    <Form.Label column sm="3" className="inputLabel">Phone Number</Form.Label>
                                    <Col sm="10">
                                    <Form.Control type="text"
                                        name="phone_number"
                                        style={{ width: '90%'}}
                                        onChange={this.onChange}
                                        value={this.state.phone_number}
                                        required={true}
                                        pattern="^[0-9]+$"
                                    />
                                    </Col>
                                </Form.Group>
                           
                            <div class ="buttonDiv">
                            <ButtonGroup aria-label="Third group">
                                <Button type="submit" variant="success">Update Details</Button>
                            </ButtonGroup>
                            
                            <ButtonGroup aria-label="Fourth group">
                                <Link to="/home"><Button variant="secondary">Cancel</Button></Link>
                            </ButtonGroup>
                            </div>
                        </Form>
                      
                       
                    </div><br/><br/><br/> 
               
            </div>
        )
    }
}

CustomerProfile.propTypes = {
    getCustomer: PropTypes.func.isRequired,
    updateCustomer: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    user: state.customerProfile.user
});

export default connect(mapStateToProps, { getCustomer, updateCustomer })(CustomerProfile);