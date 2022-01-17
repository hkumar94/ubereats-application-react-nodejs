import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import Axios from 'axios';
import Cookies from 'js-cookie';
import endPointObj from '../../endPointUrl';
import './Signup.css';

function Signup() {

    const [validated, setValidated] = useState(false);
    const [custNameReg, setCustNameReg] = useState("");
    const [custEmailReg, setCustEmailReg] = useState("");
    const [custPasswordReg, setCustPasswordReg] = useState("");

    const [restoNameReg, setRestoNameReg] = useState("");
    const [restoEmailReg, setRestoEmailReg] = useState("");
    const [restoPasswordReg, setRestoPasswordReg] = useState("");
    const [restoLocationReg, setRestoLocationReg] = useState("");
    const [alert, setAlert] = useState('');

    const cust_register = (e) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
          console.log('not validated');
          e.preventDefault();
          e.stopPropagation();
        }
        console.log(form.checkValidity());
        e.preventDefault();
        setValidated(true);
    
        if (custNameReg.length !== 0 && custPasswordReg.length !== 0 && custEmailReg.length !== 0) {
          Axios.post(endPointObj.url + 'custRegister', {
            custName: custNameReg,
            custEmail: custEmailReg,
            custPassword: custPasswordReg
          })
            .then(() => {
              Cookies.set('name', 'value', { expires: 1 });
              //logIn(emailReg, passwordReg);
              setAlert('');
            })
            .catch((err) => {
              console.log('error');
              if (err.response && err.response.data) {
                setAlert(err.response.data.message);
              }
            });
        }
      };

      const resto_register = (e) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
          console.log('not validated');
          e.preventDefault();
          e.stopPropagation();
        }
        console.log(form.checkValidity());
        e.preventDefault();
        setValidated(true);
    
        if (restoNameReg.length !== 0 && restoEmailReg.length !== 0 && restoPasswordReg.length !== 0
            && restoLocationReg.length !== 0) {
          Axios.post(endPointObj.url + 'restoRegister', {
            restoName: restoNameReg,
            restoEmail: restoEmailReg,
            restoPassword: restoPasswordReg,
            restoLocation: restoLocationReg
          })
            .then(() => {
              Cookies.set('name', 'value', { expires: 1 });
              //logIn(emailReg, passwordReg);
              setAlert('');
            })
            .catch((err) => {
              console.log('error');
              if (err.response && err.response.data) {
                setAlert(err.response.data.message);
              }
            });
        }
      };
  
  
    return( 
        <table cellSpacing="200px">
        <td>    
        <div>
            <Card className="bg-light text-black signUp-card">
              <h2> Customer Signup </h2> 
              <Container>
                <Form className="signup-div" validated={validated} onSubmit={cust_register}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label class="floatLabel"><b>Name</b></Form.Label>
                    <Form.Control
                        type="text"
                        onChange={(e) => {
                        setCustNameReg(e.target.value);
                        }}
                        placeholder="Enter name"
                        required
                        />
                 </Form.Group> <br/> <br/>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label class="floatLabel"><b >Email address</b></Form.Label>
                    <Form.Control
                            type="email"
                            onChange={(e) => {
                            setCustEmailReg(e.target.value);
                            }}
                            placeholder="Enter email"
                            required
                    />
                </Form.Group> <br/> <br/>

                <Form.Group controlId="formBasicPassword" class="input_field">
         
                    <Form.Label class="floatLabel"><b>Password</b></Form.Label>
                    <Form.Control 
                            type="password"
                            onChange={(e) => {
                            setCustPasswordReg(e.target.value);
                            }}
                            placeholder="Password"
                            required
                    /> 
                </Form.Group>  <br/> <br/>
                <Button variant="primary" type="submit">
                Sign Up
                </Button>
                {alert.length > 0 && (
                <Alert className="alert" key="0" variant="danger">
                    {alert}
                </Alert>
                )}
                </Form>
              </Container>
            </Card>
        </div>
        </td>
        <td> 
        <div>
            <Card className="bg-light text-black signUp-card">
              <h2> Restaurant Signup </h2> 
              <Container>
                <Form className="signup-div" validated={validated} onSubmit={resto_register}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label class="floatLabel"><b>Restaurant Name</b></Form.Label>
                    <Form.Control
                        type="text"
                        onChange={(e) => {
                        setRestoNameReg(e.target.value);
                        }}
                        placeholder="Enter name"
                        required
                        />
                 </Form.Group> <br/> <br/>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label class="floatLabel"><b>Email address</b></Form.Label>
                  <Form.Control
                        type="email"
                        onChange={(e) => {
                        setRestoEmailReg(e.target.value);
                        }}
                        placeholder="Enter email"
                        required
                  />
                </Form.Group> <br/> <br/>

                <Form.Group controlId="formBasicPassword" class="input_field">
         
                  <Form.Label class="floatLabel"><b>Password</b></Form.Label>
                  <Form.Control 
                        type="password"
                        onChange={(e) => {
                        setRestoPasswordReg(e.target.value);
                        }}
                        placeholder="Password"
                        required
                /> 
                </Form.Group>  <br/> <br/>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label class="floatLabel"><b>Restaurant Location</b></Form.Label>
                    <Form.Control
                        type="text"
                        onChange={(e) => {
                        setRestoLocationReg(e.target.value);
                        }}
                        placeholder="Enter Restaurant Location"
                        required
                        />
                </Form.Group> <br/> <br/>
                
                <Button variant="primary" type="submit">
                Sign Up
                </Button>
                {alert.length > 0 && (
                <Alert className="alert" key="0" variant="danger">
                    {alert}
                </Alert>
                )}
                </Form>
              </Container>
            </Card>
        </div>
        </td>
        </table>
    );
}

  export default Signup;