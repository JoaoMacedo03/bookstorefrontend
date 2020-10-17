import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import LogOut from '../pages/LogOut';
import Book from '../pages/Book'

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/signup" component={SignUp} />

    <Route path="/dashboard" component={Dashboard} isPrivate />
    <Route path="/logout" component={LogOut} isPrivate />
    <Route path="/book" component={Book} isPrivate />
  </Switch>
);

export default Routes;
