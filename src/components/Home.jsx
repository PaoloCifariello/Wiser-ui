import React, {Component} from 'react';
import {Button, Divider, Input, Message} from 'semantic-ui-react'

import ResultList from './ResultList'

import './Home.css'

import api from '../api/api'

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      lastSearchValue: "",
      isSearching: false,
      showErrorMessage: false,
      showResults: false,
      results: null
    }
  }

  componentDidMount() {
    this
      .searchInput
      .focus();
  }

  handleSearchChange = (e, {value}) => {
    this.setState({searchValue: value});
  }

  search = () => {
    const searchValue = this
      .state
      .searchValue
      .trim();
    this.setState({searchValue: searchValue})

    if (searchValue && !this.state.isSearching) {
      this.setState({isSearching: true, showErrorMessage: false, showResults: false, results: null, lastSearchValue: searchValue});
      api
        .findExpertsByExpertise(searchValue)
        .then((res) => this.showResults(res.data))
        .catch((err) => this.fail(err))
    }
  }

  showResults(response) {
    const {lastSearchValue} = this.state;
    if (lastSearchValue === response["query"]) {
      this.setState({showResults: true, isSearching: false, results: response["results"], time: response["time"]})
    }
  }

  fail(err) {
    this.setState({isSearching: false, showErrorMessage: true})

  }

  onDismissErrorMessage() {
    this.setState({showErrorMessage: false})
  }

  handleKeyPress = (evt) => {
    if (evt.key === "Enter") {
      this.search();
    }
  }

  render() {
    const {searchValue} = this.state;
    return (
      <div>
        <div>
          <Input
            id="expertise-search-bar"
            ref={(input) => this.searchInput = input}
            size="big"
            icon='search'
            placeholder='Search by expertise area...'
            value={searchValue}
            onChange={this.handleSearchChange}
            onKeyPress={this.handleKeyPress}/>
        </div>
        <div>
          <Button
            loading={this.state.isSearching}
            disabled={this.state.isSearching}
            size="large"
            color="teal"
            className="search-button"
            type='submit'
            onClick={this.search}>Search</Button>
        </div>
        {this.state.showErrorMessage
          ? <div className="margin-top15">
              <Message
                compact
                negative
                onDismiss={() => this.onDismissErrorMessage()}
                header='Search failed!'
                content='Search for expertise failed!'/>
            </div>
          : null}
        {this.state.showResults
          ? <div><Divider/><ResultList results={this.state.results}/></div>
          : null}
      </div>
    );
  }
}

export default Home;