import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'

import {Header, Image} from 'semantic-ui-react';

import {Navbar, Nav, NavItem, NavbarBrand} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'

import {About, AuthorProfile, DepartmentProfile, Search, WiserStatistics} from '.'

import UnipiLogo from './reusable/UnipiLogo';

import './App.css';
import './navbar.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar className="margin-bottom-50">
            <Nav>
              <LinkContainer exact to="/search">
                <NavItem>Home</NavItem>
              </LinkContainer>
            </Nav>

            <Nav pullRight>
              <LinkContainer exact to="/about">
                <NavItem>About</NavItem>
              </LinkContainer>
              <UnipiLogo/>
            </Nav>

          </Navbar>

          <div>
            <Switch>
              <Route exact path="/about" component={About}/>
              <Route exact path="/search" component={Search}/>
              <Route exact path="/statistics" component={WiserStatistics}/>
              <Route exact path="/search/:searchBy(e|es|n|d)/:query(.+)/" component={Search}/>
              <Route path="/profile/:authorId/:section?" component={AuthorProfile}/>
              <Route
                path="/department/:departmentName/:section?"
                component={DepartmentProfile}/>
              <Route path="*" render={() => (<Redirect to="/search"/>)}/>
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;