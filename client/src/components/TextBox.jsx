import React, { Component } from 'react';

class TextBox extends Component {
    constructor(props) {
        super(props);
    }

    render() { 
        return ( 
            <React.Fragment>
                <i className={this.props.ico} style={{color: "white"}} /> 
                <label className="parent">
                    <label className="labelTxt" id={this.props.id}> {this.props.textName} </label>
                    <input placeholder={this.props.placeholder} id={this.props.textID} name={this.props.name} type={this.props.type} 
                        className="input" required="required" pattern={this.props.pattern} title={this.props.title} 
                        minLength={this.props.minLength} />
                    <div className="lineBox">
                        <div className="line" />
                    </div>
                </label>
                <div style={{height: "10px"}} />
            </React.Fragment>  
         );
    }
}
 
export default TextBox;