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
      routes: [],
      activeRoute: null
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleRouteClick = this.handleRouteClick.bind(this);
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
        <ul className="route-list list-group">
          {
            this.getRoutes().map(route => {
              return (
                <li key={route.id} className="list-group-item" onClick={this.handleRouteClick(route)}>
                  <div className="col-2 h1" style={{backgroundColor: route.color}}>{route.difficulty}</div>
                  <div className="col-6">
                    <div className="h5">{route.name}</div>
                    <div className="text-muted">{route.traits.join(', ')}</div>
                  </div>
                  <div className="col-4 text-right text-muted">
                    <div>#{route.lineNumber}</div>
                    <div>{route.sector}</div>
                  </div>
                  {route === this.state.activeRoute ? this.renderDetails(route) : null}
                </li>
              )
            })
          }
        </ul>
      </div>
    );
  }

  renderDetails(route) {
    return (
      <div className="col-12">
        <hr/>
        { route.expired ? <div className="alert alert-warning"><strong>Expired Route</strong> This route is expired and will be decommissioned soon.</div> : null }
        <dl>
          <dt>Created</dt>
          <dd>{route.created}</dd>
          <dt>Author</dt>
          <dd>{route.author}</dd>
        </dl>
        <a href={`http://wallonsight.com/routes/detail/${route.id}`} target="_blank">More Details</a>
      </div>
    )
  }

  handleSearchChange(e) {
    this.setState({search: e.target.value});
  }

  handleRouteClick(route) {
    return (() => { // TODO: how to solve this better?
      this.setState({activeRoute: route});
    });
  }

  getRoutes() {
    return fuzzy
      .filter(deburr(this.state.search), this.state.routes, {
        extract: route => deburr(route.name) // deburr removes diactritics
      })
      .map(res => res.original);
  }

}

export default App;
