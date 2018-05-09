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
import EntityLink from "../reusable/EntityLink"
import './Search.css'

import api from '../../api/api'

class Search extends Component {

  constructor(props) {
    super(props);
    const {query} = this.props.match.params;

    this.state = {
      searchValue: query || "",
      lastSearchValue: "",
      isSearching: false,
      showErrorMessage: false,
      showResults: false,
      results: null,
      queryEntities: null
    }

  }

  componentDidMount() {
    const {searchBy, query} = this.props.match.params;

    this
      .searchInput
      .focus();

    switch (searchBy) {
      case "e":
        return this._searchByExpertise(query);
      case "n":
        return this._searchByName(query);
      default:
        return this._resetSearch();
    }
  }

  componentWillReceiveProps = ({match}) => {
    const {searchBy, query} = match.params;

    this.setState({searchValue: query});

    switch (searchBy) {
      case "e":
        return this._searchByExpertise(query);
      case "n":
        return this._searchByName(query);
      default:
        return this._resetSearch();
    }
  }

  handleSearchChange = (e, {value}) => {
    this.setState({searchValue: value});
  }

  _resetSearch = (searchValue) => {
    this.setState({searchValue: "", isSearching: false, showErrorMessage: false, showResults: false, results: null});
  }

  _searchByExpertise = (searchValue) => {
    searchValue = searchValue.trim();
    this.setState({searchValue: searchValue})

    if (searchValue && !this.state.isSearching) {
      this.setState({
        isSearching: true,
        isSearchingByExpertise: true,
        showErrorMessage: false,
        showResults: false,
        results: null,
        queryEntities: null,
        lastSearchValue: searchValue
      });
      api
        .findExpertsByExpertise(searchValue)
        .then(this.showResults)
        .catch(this.fail)
    }
  }

  _searchByName = (searchValue) => {
    searchValue = searchValue.trim();
    this.setState({searchValue: searchValue, isSearchingByName: true})

    if (searchValue && !this.state.isSearching) {
      this.setState({
        isSearching: true,
        isSearchingByName: true,
        showErrorMessage: false,
        showResults: false,
        results: null,
        queryEntities: null,
        lastSearchValue: searchValue
      });
      api
        .findExpertsByName(searchValue)
        .then(this.showResults)
        .catch(this.fail)
    }
  }

  searchByExpertise = (history) => {
    const {searchValue} = this.state;
    this
      .props
      .history
      .push(`/search/e/${searchValue}`);
  }

  searchByName = (history) => {
    const {searchValue} = this.state;
    this
      .props
      .history
      .push(`/search/n/${searchValue}`);
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
        queryEntities: response["queryEntities"],
        lastSearchTime: response["time"]
      })
    }
  }

  fail = (err) => {
    this.setState({isSearching: false, isSearchingByExpertise: false, isSearchingByName: false, showErrorMessage: true, lastError: err})

  }

  onDismissErrorMessage = () => {
    this.setState({showErrorMessage: false})
  }

  handleKeyPress = (evt) => {
    if (evt.key === "Enter") {
      this.searchByExpertise();
    }
  }

  renderQueryEntities = () => {
    const {queryEntities} = this.state;
    if (queryEntities) {
      const queryEntitiesLinks = queryEntities.map((queryEntity, index) => <span className="margin-lr-10" key={index}>{< EntityLink
        entityName = {
          queryEntity.entity_name
        }
        />}</span>)
      return <div className="margin-bottom-10">{queryEntitiesLinks}</div>
    } else {
      return null;
    }
  }

  renderResults = () => {
    const {showResults, results, lastSearchTime} = this.state
    if (showResults) 
      return (
        <div>
          {this.renderQueryEntities()}

          <div>
            <Label>
              <Icon name="time"/> {`${results
                .length} results in ${lastSearchTime
                .toFixed(3)}s`}
            </Label>
            <Divider hidden/>
            <ResultList results={results}/>
          </div>
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
            onClick={this.searchByName}>Search by Name</Button>
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

export default Search;