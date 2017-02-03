import React, { Component } from 'react';
import fuzzy from 'fuzzy';
import deburr from 'lodash.deburr';
import 'whatwg-fetch';
import './RouteList.css';

class RouteList extends Component {
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
    this.listItems = {};

    return (
      <div>
        <nav className="navbar fixed-top navbar-light bg-faded">
          <input type="text" className="form-control form-control-lg" placeholder="Search" onChange={this.handleSearchChange}/>
        </nav>
        <ul className="route-list list-group">
          {
            this.getRoutes().map(route => {
              let isActive = route === this.state.activeRoute;

              return <RouteListItem
                onClick={this.handleRouteClick(route)}
                key={route.id}
                route={route}
                active={isActive}
                ref={listItem => this.listItems[route.id] = listItem}
              />
            })
          }
        </ul>
      </div>
    );
  }

  handleSearchChange(e) {
    this.setState({search: e.target.value});
  }

  handleRouteClick(route) {
    return (() => {
      this.listItems[route.id].keepScrollPositionThroughUpdate();
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

class RouteListItem extends Component {
  render() {
    let route = this.props.route;
    let active = this.props.active;

    return (
      <li className="list-group-item" onClick={this.props.onClick} ref={el => this.el = el}>
        <div className="col-2 h1" style={{backgroundColor: route.color}}>{route.difficulty}</div>
        <div className="col-6">
          <div className="h5">{route.name}</div>
          <div className="text-muted">{route.traits.join(', ')}</div>
        </div>
        <div className="col-4 text-right text-muted">
          <div>#{route.lineNumber}</div>
          <div>{route.sector}</div>
          <div>aa{route.active}</div>
        </div>
        {active ? <RouteDetail route={route}/> : null}
      </li>
    )
  }

  keepScrollPositionThroughUpdate() {
    this.offsetTopBeforeUpdate = this.el.offsetTop;
    this.scrollTopBeforeUpdate = document.body.scrollTop;
  }

  componentDidUpdate() {
    if (this.offsetTopBeforeUpdate) {
      let beforeUpdate = this.offsetTopBeforeUpdate;
      let afterUpdate = this.el.offsetTop;
      let change = afterUpdate - beforeUpdate;

      console.log('beforeUpdate', beforeUpdate, 'afterUpdate', afterUpdate, 'change', change, 'this.scrollTopBeforeUpdate', this.scrollTopBeforeUpdate, 'document.body.scrollTop', document.body.scrollTop);

      if (document.body.scrollTop === this.scrollTopBeforeUpdate) { // change scrollTop only if user is not actively scrolling
        document.body.scrollTop += change;
      }

      this.offsetTopBeforeUpdate = null;
    }
  }
}

function RouteDetail({route}) {
  return (
    <div className="col-12">
      <hr/>
      { route.expired ? <div className="alert alert-warning"><strong>Expired Route</strong> This route is expired and will be decommissioned soon.</div> : null }
      <dl className="row">
        <dt className="col-3">Created</dt>
        <dd className="col-9">{route.created}</dd>
        <dt className="col-3">Author</dt>
        <dd className="col-9">{route.author}</dd>
      </dl>
      <a href={`http://wallonsight.com/routes/detail/${route.id}`} target="_blank">More Details</a>
    </div>
  )
}

export default RouteList;
