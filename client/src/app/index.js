import React from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import "./App.css";
import { Login, Register } from "../components/Home";

class App extends React.Component {
  constructor (props) {
    super(props);
  }
  render() {
    return ( 
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Register} />
        </Switch>
      </Router>
    </div>
    );
  }
}

export default App;