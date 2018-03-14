import React, {Component} from 'react';
import {
  Button,
  Divider,
  Grid,
  Icon,
  Input,
  Label,
  Message
} from 'semantic-ui-react'

import ResultList from './ResultList'
import WiserLogo from '../reusable/WiserLogo';

import './Home.css'

import api from '../../api/api'

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

  searchByExpertise = () => {
    const searchValue = this
      .state
      .searchValue
      .trim();
    this.setState({searchValue: searchValue})

    if (searchValue && !this.state.isSearching) {
      this.setState({
        isSearching: true,
        isSearchingByExpertise: true,
        showErrorMessage: false,
        showResults: false,
        results: null,
        lastSearchValue: searchValue
      });
      api
        .findExpertsByExpertise(searchValue)
        .then((res) => this.showResults(res.data))
        .catch(this.fail)
    }
  }

  searchByName = () => {
    const searchValue = this
      .state
      .searchValue
      .trim();
    this.setState({searchValue: searchValue, isSearchingByName: true})

    if (searchValue && !this.state.isSearching) {
      this.setState({
        isSearching: true,
        isSearchingByName: true,
        showErrorMessage: false,
        showResults: false,
        results: null,
        lastSearchValue: searchValue
      });
      api
        .findExpertsByName(searchValue)
        .then((res) => this.showResults(res.data))
        .catch(this.fail)
    }
  }

  showResults = (response) => {
    const {lastSearchValue} = this.state;
    if (lastSearchValue === response["query"]) {
      this.setState({
        showResults: true,
        isSearching: false,
        isSearchingByExpertise: false,
        isSearchingByName: false,
        results: response["results"],
        lastSearchTime: response["time"]
      })
    }
  }

  fail = (err) => {
    this.setState({isSearching: false, showErrorMessage: true, lastError: err})

  }

  onDismissErrorMessage = () => {
    this.setState({showErrorMessage: false})
  }

  handleKeyPress = (evt) => {
    if (evt.key === "Enter") {
      this.searchByExpertise();
    }
  }

  renderResults = () => {
    const {showResults, results, lastSearchTime} = this.state
    if (showResults) 
      return (
        <div>
          <Label>
            <Icon name="time"/> {`${results
              .length} results in ${lastSearchTime
              .toFixed(3)}s`}
          </Label>
          <Divider hidden/>
          <ResultList results={results}/>
        </div>
      )
  }

  renderSearchBar = () => {
    const {searchValue} = this.state;
    return (
      <Grid.Row>
        <div>
          <Input
            id="expertise-search-bar"
            ref={(input) => this.searchInput = input}
            size="big"
            icon='search'
            placeholder='Search for expertise...'
            value={searchValue}
            onChange={this.handleSearchChange}
            onKeyPress={this.handleKeyPress}/>
        </div>
      </Grid.Row>
    )
  }

  renderSearchButton = () => {
    return (
      <Grid.Row>
        <div>
          <Button
            loading={this.state.isSearchingByExpertise}
            disabled={this.state.isSearching}
            size="large"
            color="teal"
            className="search-button"
            type='submit'
            onClick={this.searchByExpertise}>Search by Expertise</Button>
        </div>
        <div>
          <Button
            loading={this.state.isSearchingByName}
            disabled={this.state.isSearching}
            size="large"
            color="teal"
            className="search-button"
            type='submit'
            onClick={this.searchByName}>Search by name</Button>
        </div>
      </Grid.Row>
    );
  }

  render() {
    const {lastError, showErrorMessage, showResults} = this.state
    return (
      <div>
        <Grid centered stackable className="margin-top15" textAlign='center'>
          <Grid.Row >
            <WiserLogo/>
          </Grid.Row>
          {this.renderSearchBar()}
          {this.renderSearchButton()}
          <Grid.Row>
            <Grid.Column>
              {showResults
                ? (<Divider/>)
                : null}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            {showErrorMessage
              ? <div className="margin-top15">
                  <Message
                    compact
                    negative
                    onDismiss={this.onDismissErrorMessage}
                    header='Search failed!'
                    content={lastError.message}/>
                </div>
              : this.renderResults()}
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Home;