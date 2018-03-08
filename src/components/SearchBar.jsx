import React, {Component} from 'react';

import {Search} from 'semantic-ui-react'

import './SearchBar.css'

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            results: []
        }
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
        const {value} = this.state;
        return (<Search
            className="border-radius0 align-center"
            size="big"
            value={value}
            {...this.props}/>)
    }
}

export default SearchBar;