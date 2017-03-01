import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
import fuzzy from 'fuzzy';
import deburr from 'lodash.deburr';
import 'whatwg-fetch';
import './RouteList.css';
import SearchInput from './SearchInput';
import RouteListItem from './RouteListItem';
import RouteDetail from './RouteDetail';

// TODO: for now let's compile routes.json into the bundle, so I don't have to care about caching
import routes from '../../routes.json';

class RouteList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      routes: [],
      activeRoute: null,
      detailOpen: false
    };
    this.afterUpdate = createTaskQueue();

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleRouteClick = this.handleRouteClick.bind(this);
    this.handleCloseDetailClick = this.handleCloseDetailClick.bind(this);
  }

  componentDidMount() {
    this.setState({routes});
    // fetch(process.env.PUBLIC_URL + '/routes.json')
    //   .then((response) => response.json())
    //   .then((routes) => {
    //     this.setState({routes});
    //   })
  }

  componentDidUpdate() {
    this.afterUpdate.flush();
  }

  render() {
    this.listItems = []; // TODO: do I still need this?

    // TODO: search
    return (
      <div>
        <List>
          {
            this.getRoutes().map(route => {
              return (
                <RouteListItem
                  key={route.id}
                  route={route}
                  onClick={this.handleRouteClick(route)}
                />
              )
            })
          }
        </List>
        <RouteDetail
          route={this.state.activeRoute}
          open={this.state.detailOpen}
          onClose={this.handleCloseDetailClick}
        />
      </div>
    )
  }

  handleSearchChange(e) {
    this.setState({search: e.target.value});

    if (e.target.value === '') {
      // user is canceling search, keep scrollTop at first item that was visible before cancel
      let item = this.listItems.find(listItem => {
        return listItem.el.offsetTop > document.body.scrollTop;
      });
      this.keepScrollAt(item);
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
      this.setState({activeRoute: route, detailOpen: true, search: ''});
    });
  }

  handleCloseDetailClick() {
    this.setState({detailOpen: false});
  }

  getRoutes() {
    return fuzzy
      .filter(deburr(this.state.search), this.state.routes, {
        extract: route => deburr(route.name) // deburr removes diactritics
      })
      .map(res => res.original);
  }

  /**
   * Make sure listItem does not change position within scrollable area after update.
   *
   * @param listItem
   */
  keepScrollAt(listItem) {
    let offsetTopBeforeUpdate = listItem.el.offsetTop;
    let scrollTopBeforeUpdate = document.body.scrollTop;

    this.afterUpdate(() => {
      this._restoreItemScrollPos(listItem, offsetTopBeforeUpdate, scrollTopBeforeUpdate);
    })
  }

  _restoreItemScrollPos(listItem, offsetTopBeforeUpdate, scrollTopBeforeUpdate) {
    if (document.body.scrollTop !== scrollTopBeforeUpdate ) {
      // do not mess with scrollTop if user is actively scrolling
      return;
    }

    // make sure scrollTop of remembered row does not change
    let beforeUpdate = offsetTopBeforeUpdate;
    let afterUpdate = listItem.el.offsetTop;
    let change = afterUpdate - beforeUpdate;
    document.body.scrollTop += change;
  }

  ensureItemVisible(listItem) {
    if (listItem.el.offsetTop + listItem.el.offsetHeight > document.body.scrollTop + window.innerHeight) {
      //listItem.el.scrollIntoView(false);
      document.body.scrollTop = listItem.el.offsetTop + listItem.el.offsetHeight - window.innerHeight + 12;
    }

    if (listItem.el.offsetTop < document.body.scrollTop + this.searchBar.offsetHeight) {
      document.body.scrollTop = listItem.el.offsetTop - this.searchBar.offsetHeight;
    }
  }

  _getListItemById(id) {
    return this.listItems.find(item => item.props.route.id === id);
  }
}


function createTaskQueue() {
  const tasks = [];

  function queueTask(task) {
    tasks.push(task);
  }

  queueTask.flush = function() {
    let task;
    while ((task = tasks.shift()) !== undefined) { // eslint-disable-line no-cond-assign
      task();
    }
  };

  return queueTask;
}


export default RouteList;
