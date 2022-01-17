import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import Axios from 'axios';
import Cookies from 'js-cookie';
import endPointObj from '../../endPointUrl';
import { setUser } from '../../actions';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Redirect, Route } from "react-router";
import './Login.css';
import '../Signup/Signup.css';



function Login() {

  const [validated, setValidated] = useState(false);
  const [custEmail, setCustEmail] = useState('');
  const [custPassword, setCustPassword] = useState('');
  const [restoEmail, setRestoEmail] = useState('');
  const [restoPassword, setrestoPassword] = useState('');
  const [alert, setAlert] = useState('');
  //const dispatch = useDispatch();

  Axios.defaults.withCredentials = true;

  const history = useHistory();

  const custLogIn = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);

    e.preventDefault();
    Axios.post(endPointObj.url + 'custLogin', {
      custEmail,
      custPassword,
    })
      .then((response) => {
        //localStorage.setItem('token', response.data.token.split(' ')[1]);
        console.log("Status Code : ",response.status);
        if(response.status === 200){
            console.log("Hey you go");
            window.open('/custHome', "_self"); 
        }
        if(response.status === 400){
            console.log("Bye");
            window.open('/login', "_self");
        }
        //dispatch(setUser(custEmail, true));
        //handleClick();

      })
      .catch((e) => {
        if (e.response && e.response.data) {
          console.log(e.response.data.message); // some reason error message
          setAlert(e.response.data.message);
        }
      });
  };

  const restoLogIn = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);

    e.preventDefault();
    Axios.post(endPointObj.url + 'restoLogin', {
      restoEmail,
      restoPassword,
    })
      .then((response) => {
        //localStorage.setItem('token', response.data.token.split(' ')[1]);
        console.log("Status Code : ",response.status);
        if(response.status === 200){
            console.log("Hey you go");
            window.open('/restoHome', "_self"); 
        }
        if(response.status === 400){
            console.log("Bye");
            window.open('/login', "_self");
        }
        //dispatch(setUser(custEmail, true));
        //handleClick();

      })
      .catch((e) => {
        if (e.response && e.response.data) {
          console.log(e.response.data.message); // some reason error message
          setAlert(e.response.data.message);
        }
      });
  };

  return (
    <table cellSpacing="200px">
        <td>   
            <div>  
            <Card className="bg-light text-black signUp-card"> 
                <h2> Customer Login </h2> 
                <Container>
                    <Form className="login" validated={validated}>
                        <Form.Group controlId="formBasicEmail">
                        <Form.Label class="floatLabel"><b>Username</b></Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            onChange={(e) => {
                            setCustEmail(e.target.value);
                            }}
                            required
                        />
                        </Form.Group> <br /> <br />

                        <Form.Group controlId="formBasicPassword">
                        <Form.Label class="floatLabel"><b>Password</b></Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            onChange={(e) => {
                            setCustPassword(e.target.value);
                            }}
                            required
                        />
                        </Form.Group> <br /> <br />
                        <Button onClick={custLogIn} variant="primary" type="submit">
                        Submit
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
                <h2> Restaurant Login </h2> 
                <Container>
                    <Form className="login" validated={validated}>
                        <Form.Group controlId="formBasicEmail">
                        <Form.Label class="floatLabel"><b>Username</b></Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            onChange={(e) => {
                            setRestoEmail(e.target.value);
                            }}
                            required
                        />
                        </Form.Group> <br /> <br />

                        <Form.Group controlId="formBasicPassword">
                        <Form.Label class="floatLabel"><b>Password</b></Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            onChange={(e) => {
                            setrestoPassword(e.target.value);
                            }}
                            required
                        />
                        </Form.Group> <br /> <br />
                        <Button onClick={restoLogIn} variant="primary" type="submit">
                        Submit
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

export default Login;