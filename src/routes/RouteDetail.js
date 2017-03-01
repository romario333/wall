import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AlertWarning from 'material-ui/svg-icons/alert/warning';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';
import RouteListItem from './RouteListItem';

function RouteDetail({route, open, onClose}) {
  route = route || {};

  let actions = [
    <FlatButton
      label="Close"
      primary={true}
      keyboardFocused={true}
      onTouchTap={onClose}
    />
  ];

  let expiredChip = (
    <Chip>
      <Avatar icon={<AlertWarning />} />
      <strong>Expired Route</strong>
    </Chip>
  )

  return (
    <Dialog
      title={<RouteListItem route={route}/>}
      actions={actions}
      open={open}
      onRequestClose={onClose}
    >
      <hr/>
      { route.expired ? expiredChip : null }
      <List>
        <Subheader>Created</Subheader>
        <ListItem>{route.created}</ListItem>
      </List>
      <dl className="row">
        <dt className="col-3">Created</dt>
        <dd className="col-9">{route.created}</dd>
        <dt className="col-3">Author</dt>
        <dd className="col-9">{route.author}</dd>
        <dt className="col-3">Sector</dt>
        <dd className="col-9">{route.sector}</dd>
      </dl>
      <a href={`http://wallonsight.com/routes/detail/${route.id}`} target="_blank">More Details</a>
    </Dialog>
  )
}

export default RouteDetail;
