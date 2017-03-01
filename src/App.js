import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import RouteList from './routes/RouteList';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <AppBar title="Route Finder" />
          <RouteList/>
        </div>
      </MuiThemeProvider>
    );
  }

}

export default App;
