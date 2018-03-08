import React, {Component} from 'react';

import api from '../api/api'

import SearchBar from './SearchBar'

import './Profiles.css'

class Profiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ssearchValue: '',
      searchResults:[],
      isLoading: false
    }
  }

  handleResultSelect = (e, {result}) => {}

  handleSearchChange = (e, {value}) => {
    this.setState({searchValue: value});

    if (value.length > 2) {
      this.setState({
        isLoading: true,
        searchResults: []

      });
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
                  return {"title": `${author.name} (${author.id})`, "description": author.institution};
                })
            })
          }

        })
    }
  }

  render() {
    const {isLoading, searchValue, searchResults} = this.state;

    return (
      <div>
        <div>
          <SearchBar
            loading={isLoading}
            showNoResults={!isLoading}
            minCharacters={3}
            placeholder="Search by author name..."
            results={searchResults}
            value={searchValue}
            onResultSelect={this.handleResultSelect}
            onSearchChange={this.handleSearchChange}/>
        </div>
        {/* <div>
          <Button size="large" color="teal" className="search-button" type='submit'>Search</Button>
        </div> */}

      </div>
    );
  }
}

export default Profiles;