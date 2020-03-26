import React, { Component } from "react";
import loginImg from "../images/logo.png";
import TextBox from '../components';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import api from '../api';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
    }

    componentDidMount = () => {
        document.title = "Login Page";
    } 

    getEM = (email) => { this.setState({ email }); } 
    getPW = (password) => { this.setState({ password }); }

    onLoginPost = (loginData) => { api.performLogin(loginData); }

    render() {
        return (
            <div className="bodyCard">
                <img className="logo" src={ loginImg } />
                <Card.Title className="cardTitle"> Welcome to PAMS </Card.Title>
                <div style={{height: "5px"}} />
                <Card.Subtitle style={{color: "white", textAlign: "center", fontFamily: "sans-serif"}}> 
                    we help you organize flexible appointments with the most qualified doctors around you 
                </Card.Subtitle>
                <Card.Body className="cardBody" style={{paddingTop: "15px"}}>
                    <Form className="form" method="post" action="/login">
                        <Button className="headerButtons"> Login </Button>     
                        <span style={{margin: "0 2px"}} />   
                        <Button className="headerButtons" style={{paddingRight: "58px"}}> 
                            <a className="link" href="/register"> Register </a> 
                        </Button>
                        <div className="lineBox" style={{width: "46.5%"}}> <div className="line" /> </div>   
                        <div style={{height: "10px"}} />
                        <TextBox ico="fa fa-envelope icon" name="email" type="email" textName="Email" />
                        <TextBox ico="fa fa-key icon" name="password" type="password" minlength="3" textName="Password" />
                        <Button variant="primary" type="submit" className="sub"> 
                            <i className="fa fa-sign-in icon" style={{color: "#03447e", paddingRight: "10px"}} />
                            Login 
                        </Button>
                        <div style={{height: "7px"}} />
                    </Form>
                </Card.Body>
            </div>
        );
    }
}

export default Login;