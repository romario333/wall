import React, { Component } from 'react';
import classNames from 'classnames';
import contrast from 'contrast';
import RouteDetail from './RouteDetail';

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
          <div className="row align-items-center">
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

export default RouteListItem;
