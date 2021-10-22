import React from 'react';
import ReactDOM from 'react-dom';
import RouteApp from './App';

import Home from './pages/readsign';
import UploadSign from './pages/uploadsign';


import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

ReactDOM.render(
  <React.StrictMode>
      <Router>
            <Switch>
              <RouteApp path={'/'} exact component={Home} />     
              <RouteApp path={'/uploadsign'} exact component={UploadSign} />             
            </Switch>
      </Router>
    {/* <App /> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
