import React, {Component} from 'react';

import {Grid} from 'semantic-ui-react'

import api from '../../api/api'

import SearchBar from './SearchBar'

import './Profiles.css'

class Profiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ssearchValue: '',
      searchResults: [],
      isLoading: false
    }
  }

  componentDidMount() {
    this
      .searchBar
      .focus();
  }

  handleResultSelect = (e, {result}) => {
    this
      .props
      .history
      .push(`/profile/${result.id}`)
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
                .map((author, index) => {
                  return {"title": author.name, "description": author.institution, "id": author.id};
                })
            })
          }

        })
    }
  }

  render() {
    const {isLoading, searchValue, searchResults} = this.state;

    return (
      <Grid centered className="margin-top15" textAlign='left' columns={3}>
        <Grid.Row>
          <Grid.Column>
            <div>
              <SearchBar
                ref={(searchBar => this.searchBar = searchBar)}
                loading={isLoading}
                showNoResults={!isLoading}
                minCharacters={3}
                placeholder="Search by author name..."
                results={searchResults}
                value={searchValue}
                onResultSelect={this.handleResultSelect}
                onSearchChange={this.handleSearchChange}/>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Profiles;