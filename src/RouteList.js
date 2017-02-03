import React, { Component } from 'react';
import fuzzy from 'fuzzy';
import deburr from 'lodash.deburr';
import 'whatwg-fetch';
import classNames from 'classnames';
import './RouteList.css';

// TODO: for now let's compile routes.json into the bundle, so I don't have to care about caching
import routes from '../public/routes.json';

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
    this.setState({routes});
    // fetch(process.env.PUBLIC_URL + '/routes.json')
    //   .then((response) => response.json())
    //   .then((routes) => {
    //     this.setState({routes});
    //   })
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

      this.rememberPosition(this.listItems[route.id]); // TODO: tohle je divny
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

  componentDidUpdate() {
    this.updateScrollTop();
  }

  rememberPosition(listItem) {
    this.offsetTopBeforeUpdate = listItem.el.offsetTop;
    this.scrollTopBeforeUpdate = document.body.scrollTop;
  }

  updateScrollTop() {
    let offsetTopBeforeUpdate = this.offsetTopBeforeUpdate;
    let scrollTopBeforeUpdate = this.scrollTopBeforeUpdate;
    this.offsetTopBeforeUpdate = null;
    this.scrollTopBeforeUpdate = null;

    if (document.body.scrollTop !== scrollTopBeforeUpdate || !this.state.activeRoute) {
      // do not mess with scrollTop if user is actively scrolling
      return;
    }

    let listItem = this.listItems[this.state.activeRoute.id];

    // make sure position of newly selected route does not change
    if (offsetTopBeforeUpdate) {
      let beforeUpdate = offsetTopBeforeUpdate;
      let afterUpdate = listItem.el.offsetTop;
      let change = afterUpdate - beforeUpdate;
      document.body.scrollTop += change;
    }

    // scroll if active route does not fit the screen
    if (listItem.el.offsetTop + listItem.el.offsetHeight > document.body.scrollTop + window.innerHeight) {
      //listItem.el.scrollIntoView(false);
      // TODO: why +98?
      document.body.scrollTop = listItem.el.offsetTop + listItem.el.offsetHeight - window.innerHeight + 98;
    }
  }

}

class RouteListItem extends Component {
  render() {
    let route = this.props.route;
    let active = this.props.active;

    return (
      <li className={classNames({'list-group-item': true, 'route-list-item-active': active})}
          onClick={this.props.onClick}
          ref={el => this.el = el}
      >
        <div className="col-2 h1" style={{backgroundColor: route.color}}>{route.difficulty}</div>
        <div className="col-6">
          <div className="h5">{route.name}</div>
          <div className="text-muted">{route.traits.join(', ')}</div>
        </div>
        <div className="col-4 text-right text-muted">
          <div>#{route.lineNumber}</div>
          <div>{route.sector}</div>
        </div>
        {active ? <RouteDetail route={route}/> : null}
      </li>
    )
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
