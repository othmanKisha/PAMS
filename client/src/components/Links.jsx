import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Links extends Component {
    render() {
        return (
            <React.Fragment>
                <Link to="/" className="navbar-brand">
                    My first MERN Application
                </Link>
            </React.Fragment>
        )
    }
}

export default Links