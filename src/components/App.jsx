import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'

import {Navbar, Nav, NavItem} from 'react-bootstrap'
import {IndexLinkContainer, LinkContainer} from 'react-router-bootstrap'

import {Home, About, Profiles, AuthorProfile }  from '.'

import './App.css';
import './navbar.css';
import wiserLogo from './wiser-logo.png'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="h100">
          <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                <IndexLinkContainer to="/" text="Wiser">
                  <a className="App-logo-container">
                    <img src={wiserLogo} className="App-logo" alt="logo"/> {/* <a>Wiser</a> */}
                  </a>
                </IndexLinkContainer>
              </Navbar.Brand>
            </Navbar.Header>
            <Nav>
              <LinkContainer exact to="/">
                <NavItem>Home</NavItem>
              </LinkContainer>
            </Nav>
            <Nav>
              <LinkContainer exact to="/profiles">
                <NavItem>Profiles</NavItem>
              </LinkContainer>
            </Nav>
            <Nav pullRight>
              <LinkContainer exact to="/about">
                <NavItem>About</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar>

          <div className="h100">
            <Route exact path="/" component={Home}/>
            <Route exact path="/about" component={About}/>
            <Route exact path="/profiles" component={Profiles}/>
            <Route path="/profile/:authorId" component={AuthorProfile}/>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;