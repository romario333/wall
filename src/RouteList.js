import React, { Component } from 'react';
import fuzzy from 'fuzzy';
import deburr from 'lodash.deburr';
import 'whatwg-fetch';
import classNames from 'classnames';
import contrast from 'contrast';
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
    this.listItems = [];

    return (
      <div>
        <nav className="navbar fixed-top navbar-light bg-faded">
          <input type="search" className="form-control form-control-lg" placeholder="Search" onChange={this.handleSearchChange} />
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
                ref={listItem => listItem != null && this.listItems.push(listItem)}
              />
            })
          }
        </ul>
      </div>
    );
  }

  handleSearchChange(e) {
    this.setState({search: e.target.value});

    if (e.target.value === '') {
      // user is canceling search, keep scrollTop at first item that was visible before cancel
      let item = this.listItems.find(listItem => {
        return listItem.el.offsetTop > document.body.scrollTop;
      });
      this.keepItemScrollPos(item);
    } else {
      document.body.scrollTop = 0;
    }
  }

  handleRouteClick(route) {
    return (() => {

      this.keepItemScrollPos(this._getListItemById(route.id));
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

  keepItemScrollPos(listItem) {
    this.keepScrollPos = {
      listItem: listItem,
      offsetTopBeforeUpdate: listItem.el.offsetTop,
      scrollTopBeforeUpdate: document.body.scrollTop
    };
  }

  updateScrollTop() {
    let scrollPos = this.keepScrollPos;
    this.keepScrollPos = null;

    if (scrollPos && document.body.scrollTop !== scrollPos.scrollTopBeforeUpdate ) {
      // do not mess with scrollTop if user is actively scrolling
      return;
    }

    let listItem = scrollPos.listItem;

    // make sure position of newly selected route does not change
    if (scrollPos.offsetTopBeforeUpdate) {
      let beforeUpdate = scrollPos.offsetTopBeforeUpdate;
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

  _getListItemById(id) {
    return this.listItems.find(item => item.props.route.id === id);
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
        <div className="col">
          <div className="row">
            <div className="col-auto">
              <div className={`route-difficulty h1 align-middle route-color-${contrast(route.color || '#fff')}`}
                   style={{backgroundColor: route.color}}
              >
                {route.difficulty}
              </div>
            </div>
            <div className="col">
              <div className="row">
                <div className="col-9">
                  <div className="h5">{route.name}</div>
                  <div className="text-muted">{route.traits.join(', ')}</div>
                </div>
                <div className="col text-right text-muted">
                  <div>#{route.lineNumber}</div>
                </div>
              </div>
            </div>
          </div>
          {active ? (
              <div className="row">
                <div className="col p-0"><RouteDetail route={route}/></div>
              </div>
            ) : null}
        </div>
      </li>
    )
  }
}

function RouteDetail({route}) {
  return (
    <div>
      <hr/>
      { route.expired ? <div className="alert alert-warning"><strong>Expired Route</strong> This route is expired and will be decommissioned soon.</div> : null }
      <dl className="row">
        <dt className="col-3">Created</dt>
        <dd className="col-9">{route.created}</dd>
        <dt className="col-3">Author</dt>
        <dd className="col-9">{route.author}</dd>
        <dt className="col-3">Sector</dt>
        <dd className="col-9">{route.sector}</dd>
      </dl>
      <a href={`http://wallonsight.com/routes/detail/${route.id}`} target="_blank">More Details</a>
    </div>
  )
}

export default RouteList;
