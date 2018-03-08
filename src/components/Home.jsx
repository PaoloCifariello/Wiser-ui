import React, {Component} from 'react';
import {Button, Input, Message} from 'semantic-ui-react'

import ResultList from './ResultList'

import './Home.css'

import api from '../api/api'

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
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

  updateInputValue(evt) {
    this.setState({inputValue: evt.target.value});
  }

  search(evt) {
    if (this.state.inputValue) {
      this.setState({isSearching: true, showErrorMessage: false, showResults: false, results: null});
      api
        .findExpertsByExpertise(this.state.inputValue)
        .then((res) => this.showResults(res.data))
        .catch((err) => this.fail(err))
    }
  }

  showResults(results) {
    this.setState({showResults: true, isSearching: false, results: results[1], time: results[2]})
  }

  fail(err) {
    this.setState({isSearching: false, showErrorMessage: true})

  }

  onDismissErrorMessage() {
    this.setState({showErrorMessage: false})
  }

  onKeyPress(evt) {
    if (evt.key === "Enter") {
      this.search();
    }
  }

  render() {
    return (
      <div>
        <div>
          <Input
            id="expertise-search-bar"
            ref={(input) => this.searchInput = input}
            size="large"
            icon='search'
            placeholder='Search by expertise area...'
            value={this.state.inputValue}
            onChange={evt => this.updateInputValue(evt)}
            onKeyPress={evt => this.onKeyPress(evt)}/>
        </div>
        <div>
          <Button
            loading={this.state.isSearching}
            disabled={this.state.isSearching}
            size="large"
            color="teal"
            className="search-button"
            type='submit'
            onClick={evt => this.search(evt)}>Search</Button>
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
          ? <div>
              <ResultList results={this.state.results}/>
            </div>
          : null}
      </div>
    );
  }
}

export default Home;