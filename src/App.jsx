import React, { Component } from 'react';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from './containers/Login/Login';
import Toolbar from './components/Navigation/Toolbar/Toolbar';
import Patients from './containers/Patients/Patients';
import FoodSuggestions from './containers/FoodSuggestions/FoodSuggestions';
import Main from './components/Main/Main.jsx';
import Logout from './containers/Logout/Logout';
import Subscribe from './containers/Subscribe/Subscribe';
import Foods from './containers/Foods/Foods';

class App extends Component {
  state = { isAuthenticated: false };

  componentDidMount = async () => {
      const isAuthenticated = localStorage.getItem('stored_auth') || false;
      if (isAuthenticated === '1') {
          await new Promise((resolve) => {
              this.setState({ isAuthenticated: true }, () => {
                  resolve();
              });
          });
      }
  };

  loginHandler = () => {
      this.setState({ isAuthenticated: true });
  };

  logoutHandler = async () => {
      await new Promise((resolve) => {
          localStorage.setItem('stored_token', '');
          localStorage.setItem('stored_refresh', '');
          localStorage.setItem('stored_auth', false);
          this.setState({ isAuthenticated: false }, () => {
              resolve();
          });
      });
  };

  render() {
      let routes = (
      <Switch>
        <Route
          path="/auth"
          render={ (props) => (
            <Login { ...props } updateLogin={ this.loginHandler } />
          ) }
        />
        <Route
          path="/subscription"
          render={ (props) => <Subscribe { ...props } /> }
        />
        <Route path="/" render={ (props) => <Main { ...props } /> } />
        <Redirect to="/" />
      </Switch>
      );

      if (this.state.isAuthenticated) {
          routes = (
        <Switch>
          <Route
            path="/pacientes"
            render={ (props) => <Patients { ...props } /> }
          />
          <Route
            path="/cardapio/:id/:ficha_id"
            render={ (props) => <FoodSuggestions { ...props } /> }
          />
          <Route
            path="/alimentos"
            render={ (props) => <Foods { ...props } /> }
          />
          <Route
            path="/logout"
            render={ (props) => (
              <Logout { ...props } updateLogout={ this.logoutHandler } />
            ) }
          />
          <Route path="/" 
            render={ (props) => <Main { ...props } /> }
          />
          <Redirect to="/" />
        </Switch>
          );
      }
      return (
      <div className="App">
        <Toolbar isAuth={ this.state.isAuthenticated } />
        <div className="NotToolbar">{routes}</div>
      </div>
      );
  }
}

export default App;
