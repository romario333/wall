import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Difficulty from './Difficulty';

function RouteListItem({route, onClick}) {
  return (
    <ListItem
      leftAvatar={Difficulty({route})}
      primaryText={route.name}
      secondaryText={route.traits.join(', ')}
      rightAvatar={<div>#{route.lineNumber}</div>}
      onClick={onClick}
    />
  )
}

export default RouteListItem;
