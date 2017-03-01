import React from 'react';
import Avatar from 'material-ui/Avatar';
import {white, black} from 'material-ui/styles/colors';
import contrast from 'contrast';

function Difficulty({route}) {
  let isDarkColor = contrast(route.color || '#fff') === 'dark';

  return <Avatar backgroundColor={route.color} color={isDarkColor ? white : black}>{route.difficulty}</Avatar>
}


export default Difficulty;
