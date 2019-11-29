import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Router from './router';
import './App.scss';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        {
          Router.map((item, index) => {
            return <Route path={item.path} key={index} component={item.component}></Route>
          })
        }
      </Switch>
    </BrowserRouter>
  );
}

export default App;
