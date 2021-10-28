import React from 'react';
import { Route } from 'react-router-dom';

const App = ({ component: Component, rest }) => {
  return (
    <Route
      {...rest}
      render={(routeProps) => (
          <Component {...routeProps} />
      )}
    />
  );
};

export default App;