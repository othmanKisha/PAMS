import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { Button, DropdownButton, Dropdown } from 'react-bootstrap'

class SideBar extends Component {
    render() {
        return (
            <React.Fragment>
                <ButtonGroup vertical>
                    <Button> Clinics </Button>
                    <Button> Dentists </Button>
                    <Button> News </Button>
                    <Button> Appointments </Button>
                    
                    <DropdownButton as={ButtonGroup} title="Manage Clinic" id="bg-vertical-dropdown-1">
                        <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
                        <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
                    </DropdownButton>

                    <DropdownButton as={ButtonGroup} title="Manage System" id="bg-vertical-dropdown-2">
                        <Dropdown.Item eventKey="1"> Dropdown link </Dropdown.Item>
                        <Dropdown.Item eventKey="2"> Dropdown link </Dropdown.Item>
                    </DropdownButton>

                </ButtonGroup>                
            </React.Fragment>
        )
    }
}

export default SideBar
