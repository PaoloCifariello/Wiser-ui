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

  componentDidMount() {
    this.searchBar.focus();
  }

  handleResultSelect = (e, {result}) => {

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
        {/* <div>
          <Button size="large" color="teal" className="search-button" type='submit'>Search</Button>
        </div> */}

      </div>
    );
  }
}

export default Profiles;