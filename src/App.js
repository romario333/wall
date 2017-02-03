import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import RouteList from './RouteList';
import './App.css';

class App extends Component {

  render() {
    return (
      <div className="cointainer">
        <RouteList></RouteList>
      </div>
    );
  }

}

export default App;
