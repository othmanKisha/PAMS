import React from "react";
import loginImg from "../../logo.png";
import TextBox from './TextBox';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
        return (
            <div className="bodyCard">
                <img className="logo" src={ loginImg } />
                <Card.Title className="cardTitle"> Welcome to PAMS </Card.Title>
                <div style={{height: "5px"}} />
                <Card.Subtitle style={{color: "white", textAlign: "center", fontFamily: "sans-serif"}}> 
                    we help you organize flexible appointments with the most qualified doctors around you 
                </Card.Subtitle>
                <Card.Body className="cardBody" style={{paddingTop: "35px"}}>
                    <Form className="form" method="post" action="/login">
                        <TextBox ico="fa fa-envelope icon" name="email" type="email" textName="Email" />
                        <TextBox ico="fa fa-key icon" name="password" type="password" minlength="3" textName="Password" />
                        <Button variant="primary" type="submit" className="sub"> 
                            <i className="fa fa-sign-in icon" style={{color: "#03447e", paddingRight: "10px"}} />
                            Login 
                        </Button>
                        <div style={{height: "7px"}} />
                        <a href="/register" className="link"> Don't have an account? Register! </a>
                    </Form>
                </Card.Body>
            </div>
        );
    }
}

export default Login;