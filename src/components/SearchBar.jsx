import React, {Component} from 'react';

import {Input, Search} from 'semantic-ui-react'

import './SearchBar.css'

class SearchBar extends Component {
    // constructor(props) {
    //     super(props);
    // }

    focus = () => {
        this.searchInput.focus();
    }
    // onChangeInput = (e, {value}) => {
    //     this.setState({value: value});
    //     this
    //         .props
    //         .onChangeInput(value);
    // }

    // searchBarRenderer = () => {
    //     return (<Input
    //         id="profiles-search-bar"
    //         size="large"
    //         icon='search'
    //         placeholder='Search by author name...'
    //         onChange={this.onChangeInput}/>)
    // }

    render() {
        return (<Search
            ref={(searchBar => this.searchBar = searchBar)}
            input={<Input ref={input => { this.searchInput = input}} />}
            className="border-radius0 align-center"
            size="big"
            {...this.props}/>)
    }
}

export default SearchBar;