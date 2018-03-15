import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'

import {Navbar, Nav, NavItem} from 'react-bootstrap'
import {IndexLinkContainer, LinkContainer} from 'react-router-bootstrap'

import {Home, About, Profiles, AuthorProfile} from '.'

import './App.css';
import './navbar.css';
import wiserLogo from './wiser-logo.svg'

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar className="margin-bottom-50">
            {/* <Navbar.Header>
              <Navbar.Brand>
                <IndexLinkContainer to="/" text="Wiser">
                  <a className="App-logo-container">
                    <img src={wiserLogo} className="App-logo" alt="logo"/>
                  </a>
                </IndexLinkContainer>
              </Navbar.Brand>
            </Navbar.Header> */}
            <Nav>
              <LinkContainer exact to="/">
                <NavItem>Home</NavItem>
              </LinkContainer>
            </Nav>
            {/* <Nav>
              <LinkContainer exact to="/profiles">
                <NavItem>Profiles</NavItem>
              </LinkContainer>
            </Nav> */}
            <Nav pullRight>
              <LinkContainer exact to="/about">
                <NavItem>About</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar>

          <div>
            <Switch>
              <Route exact path="/about" component={About}/>
              <Route exact path="/profile/:authorId" component={AuthorProfile}/>
              <Route exact path="/search" component={Home}/>
              <Route exact path="/search/:searchBy(e|n)/:query(.+)/" component={Home}/>
              <Route path="*" render={() => (<Redirect to="/search" />)} /> 
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;