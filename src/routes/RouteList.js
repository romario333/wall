import React, { Component } from 'react';
import fuzzy from 'fuzzy';
import deburr from 'lodash.deburr';
import 'whatwg-fetch';
import './RouteList.css';
import RouteListItem from './RouteListItem';
import SearchInput from './SearchInput';

// TODO: for now let's compile routes.json into the bundle, so I don't have to care about caching
import routes from '../../public/routes.json';

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
        <nav className="navbar fixed-top navbar-light bg-faded" ref={el => this.searchBar = el}>
          <SearchInput
            className="form-control form-control-lg"
            placeholder="Search"
            value={this.state.search}
            onChange={this.handleSearchChange}
            onSearch={this.handleSearch} />
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
      this._rememberItemScrollPos(item);
    } else {
      document.body.scrollTop = 0;
    }
  }

  // invoked when search is completed
  handleSearch() {
    if (document.activeElement) {
      // hide on-screen keyboard
      document.activeElement.blur();
    }
  }

  handleRouteClick(route) {
    return (() => {
      this._rememberItemScrollPos(this._getListItemById(route.id));
      this.setState({activeRoute: route, search: ''});
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
    this._restoreItemScrollPos();
    this._ensureActiveItemVisible();
  }

  _rememberItemScrollPos(listItem) {
    this.keepScrollPos = {
      listItem: listItem,
      offsetTopBeforeUpdate: listItem.el.offsetTop,
      scrollTopBeforeUpdate: document.body.scrollTop
    };
  }

  _restoreItemScrollPos() {
    if (!this.keepScrollPos) {
      return;
    }

    let scrollPos = this.keepScrollPos;
    this.keepScrollPos = null;

    if (scrollPos && document.body.scrollTop !== scrollPos.scrollTopBeforeUpdate ) {
      // do not mess with scrollTop if user is actively scrolling
      return;
    }

    let listItem = scrollPos.listItem;

    // make sure scrollTop of remembered row does not change
    let beforeUpdate = scrollPos.offsetTopBeforeUpdate;
    let afterUpdate = listItem.el.offsetTop;
    let change = afterUpdate - beforeUpdate;
    document.body.scrollTop += change;
  }

  _ensureActiveItemVisible() {
    let listItem = this.listItems.find(item => item.props.route === this.state.activeRoute);
    if (listItem) {
      if (listItem.el.offsetTop + listItem.el.offsetHeight > document.body.scrollTop + window.innerHeight) {
        //listItem.el.scrollIntoView(false);
        document.body.scrollTop = listItem.el.offsetTop + listItem.el.offsetHeight - window.innerHeight;
      }

      if (listItem.el.offsetTop < document.body.scrollTop + this.searchBar.offsetHeight) {
        document.body.scrollTop = listItem.el.offsetTop - this.searchBar.offsetHeight;
      }
    }
  }

  _getListItemById(id) {
    return this.listItems.find(item => item.props.route.id === id);
  }

}

export default RouteList;
