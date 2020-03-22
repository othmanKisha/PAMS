import React from "react";
import loginImg from "../../logo.png";
import TextBox from './TextBox';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

class Register extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
        return (
            <div className="bodyCard" style={{height: "500px"}}>
                <img className="logo" src={ loginImg } />
                <Card.Title className="cardTitle" style={{fontSize: "23px"}}> 
                    Patient Appointment Management System
                </Card.Title>
                <Card.Body className="cardBody" style={{paddingTop: "35px"}}>
                    <Form className="form" method="post" action="/login">
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
                        <TextBox ico="fa fa-phone icon" placeholder="05xxxxxxxx" name="number" type="text" textName="Phone Number"
                            pattern="[0]{1}[5]{1}[0-9]{8}" title="Invalid number" />    
                        <TextBox ico="fa fa-key icon" name="password" id="password" type="password" 
                            textName="Password" minlength="3" />
                        <TextBox ico="fa fa-key icon" textID="confirmtext" textName="Confirm Password" 
                            name="confirm" id="confirm" type="password" />
                        <Button variant="primary" type="submit" id="btnSubmit" className="sub"> 
                            <i className="fa fa-user-plus icon" style={{color: "#03447e", paddingRight: "10px"}} />
                            Register 
                        </Button>
                        <div style={{height: "7px"}} />
                        <a href="/" className="link"> Have an account? Login! </a>
                    </Form>
                </Card.Body>
            </div>
        );
    }
}

export default Register;