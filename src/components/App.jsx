import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'

import {Navbar, Nav, NavItem} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'

import {About, AuthorProfile, Search, WiserStatistics} from '.'

import './App.css';
import './navbar.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar className="margin-bottom-50">
            <Nav>
              <LinkContainer exact to="/">
                <NavItem>Home</NavItem>
              </LinkContainer>
            </Nav>
            <Nav pullRight>
              <LinkContainer exact to="/statistics">
                <NavItem>Statistics</NavItem>
              </LinkContainer>
              <LinkContainer exact to="/about">
                <NavItem>About</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar>

          <div>
            <Switch>
              <Route exact path="/about" component={About}/>
              <Route exact path="/search" component={Search}/>
              <Route exact path="/statistics" component={WiserStatistics}/>
              <Route exact path="/search/:searchBy(e|n)/:query(.+)/" component={Search}/>
              <Route path="/profile/:authorId/:section?" component={AuthorProfile}/>
              <Route path="*" render={() => (<Redirect to="/search"/>)}/>
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;