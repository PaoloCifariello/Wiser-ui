import React, {Component} from 'react';
import PropTypes from 'prop-types'

import {Grid, Header, Input, Search} from 'semantic-ui-react'

import api from '../../api/api'

import './Profiles.css'
import WiserLogo from '../reusable/WiserLogo';

const resultRenderer = ({id, name, institution}) => (
  <div key={id} className="result align-text-left">
    <div className="content">
      <div className="title">{name}</div>
      <div className="description">{institution}</div>
    </div>
  </div>
);

resultRenderer.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  institution: PropTypes.string
}

class Profiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      searchResults: [],
      isLoading: false
    }
  }

  componentDidMount() {
    this
      .searchInput
      .focus();
  }

  handleResultSelect = (e, {result}) => {
    this
      .props
      .history
      .push(`/profile/${result.author_id}`)
  }

  handleSearchChange = (e, {value}) => {
    this.setState({
      searchValue: value,
      isLoading: (value.length > 2),
      searchResults: []
    });

    if (value.length > 2) {
      api
        .findExpertsByName(value)
        .then((res) => {
          if (this.state.searchValue === value) {
            this.setState({
              isLoading: false,
              searchResults: res
                .data
                .authors
                .map(({id, name, institution}) => {
                  return {author_id: id, childKey: id, name: name, institution: institution}
                })
            })
          }
        })
    }
  }

  render() {
    const {isLoading, searchValue, searchResults} = this.state;
    return (
      <Grid centered stackable className="margin-top15" textAlign='center'>
        <Grid.Row >
          <WiserLogo />
        </Grid.Row>
        <Grid.Row >
          <Search
            input={< Input ref = {
            input => {
              this.searchInput = input
            }
          } />}
            fluid
            className="border-radius0"
            size="big"
            loading={isLoading}
            showNoResults={!isLoading}
            minCharacters={3}
            placeholder="Search by author name..."
            results={searchResults}
            value={searchValue}
            resultRenderer={resultRenderer}
            onResultSelect={this.handleResultSelect}
            onSearchChange={this.handleSearchChange}/>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Profiles;