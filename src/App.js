import React, { Component } from 'react';
import fuzzy from 'fuzzy';
import deburr from 'lodash.deburr';
import 'whatwg-fetch';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      routes: []
    }
    
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }
  
  componentDidMount() {
    fetch(process.env.PUBLIC_URL + '/routes.json')
      .then((response) => response.json())
      .then((routes) => {
        this.setState({routes});
      })
  }
  
  render() {
    return (
      <div className="cointainer">
        <nav className="navbar fixed-top navbar-light bg-faded">
          <input type="text" className="form-control form-control-lg" placeholder="Search" onChange={this.handleSearchChange}/>
        </nav>
        <div className="row">
          <div className="col">
            <ul className="route-list list-group">
              {
                this.getRoutes().map(route => {
                  return (
                    <li key={route.id} className="list-group-item">
                      <div className="col-2 h1" style={{backgroundColor: route.color}}>{route.difficulty}</div>
                      <div className="col">
                        <div className="h5">{route.name}</div>
                        <div className="text-muted">{route.traits.join(', ')}</div>
                      </div>
                      <div className="col-4 text-right text-muted">
                        <div>#{route.lineNumber}</div>
                        <div>{route.sector}</div>
                      </div>
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
  
  handleSearchChange(e) {
    this.setState({search: e.target.value});
  }
  
  getRoutes() {
    let res = fuzzy
      .filter(deburr(this.state.search), this.state.routes, {
        extract: route => deburr(route.name) // deburr removes diactritics
      })
      .map(res => res.original);
    return res;
  }

}

export default App;
