import React, { Component } from "react";
import loginImg from "../images/logo.png";
import TextBox from '../components';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import api from '../api';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            phone: 0,
            password: ""
        };
    }

    componentDidMount = () => {
        document.title = "Registration Page";
    }
  
    getFN =  (first_name) => { this.setState({ first_name }); }
    getLN =  (last_name) => { this.setState({ last_name }); }
    getEM =  (email) => { this.setState({ email }); }
    getPN =  (phone) => { this.setState({ phone }); }
    getPW =  (password) => { this.setState({ password }); }

    onRegisterPost = (registerData) => { api.performRegister(registerData); }

    render() {
        return (
            <div className="bodyCard" style={{height: "500px"}}>
                <img className="logo" src={ loginImg } />
                <Card.Title className="cardTitle" style={{fontSize: "23px"}}> 
                    Patient Appointment Management System
                </Card.Title>
                <Card.Body className="cardBody" style={{paddingTop: "10px"}}>
                    <Form className="form" method="post" action="/login">
                        <table>
                            <tr>
                                <td> 
                                    <Button className="headerButtons"> 
                                        <a className="link" href="/"> Login </a> 
                                    </Button> 
                                </td>
                                <td>
                                    <Button className="headerButtons"> Register </Button>
                                    <div className="lineBox" > <div className="line" /> </div>
                                </td>
                            </tr>
                        </table>
                        <div style={{height: "10px"}} />
                        <table>
                            <tr>
                                <td>
                                    <TextBox ico="fa fa-user icon" name="fname" type="text" textName="First Name" 
                                        pattern="[A-Za-z]{1,15}" title="Please use only characters" />                                    
                                </td>
                                <td> <div style={{width: "20px"}} /> </td>
                                <td>
                                    <TextBox ico="fa fa-user icon" name="lname" type="text" textName="Last Name"
                                        pattern="^[A-Za-z]{1,15}" title="Please use only characters" />
                                </td>
                            </tr>
                        </table>
                        <TextBox ico="fa fa-envelope icon" name="email" type="email" textName="Email"
                            pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$" title="Invalid email" />    
                        <TextBox ico="fa fa-phone icon" placeholder="05xxxxxxxx" name="number" type="text" 
                            textName="Phone Number" pattern="[0]{1}[5]{1}[0-9]{8}" title="Invalid number" />    
                        <TextBox ico="fa fa-key icon" name="password" id="password" type="password" 
                            textName="Password" minlength="3" />
                        <TextBox ico="fa fa-key icon" textID="confirmtext" textName="Confirm Password" 
                            name="confirm" id="confirm" type="password" />
                        <Button variant="primary" type="submit" id="btnSubmit" className="sub"> 
                            <i className="fa fa-user-plus icon" style={{color: "#03447e", paddingRight: "10px"}} />
                            Register 
                        </Button>
                        <div style={{height: "7px"}} />
                    </Form>
                </Card.Body>
            </div>
        );
    }
}

export default Register;