import React, {Component} from 'react';
import {Label, Menu, Tab} from 'semantic-ui-react'

import AuthorPublicationList from './AuthorPublicationList'

import './AuthorPublications.css'

class AuthorPublications extends Component {
    constructor(props) {
        super(props);
        const {authorId, authorYears} = this.props.authorInformation;
        const sortedAuthorYears = Object
            .keys(authorYears)
            .sort((a, b) => b - a);

        this.state = {
            activeIndex: 0,
            authorId,
            authorYears,
            sortedAuthorYears
        }
    }

    handleItemClick = (e, {year}) => this.setState({selectedYear: year})
    handleTabChange = (e, {activeIndex}) => {
        this.setState({activeIndex})
    }
    render = () => {
        const {authorId, activeIndex, authorYears, sortedAuthorYears} = this.state

        const panes = sortedAuthorYears.map((year, index) => {
            return {
                menuItem: <Menu.Item key={year}>
                    <Label
                        circular
                        color={activeIndex === index
                        ? "teal"
                        : "grey"}>{authorYears[year]}</Label>{year}</Menu.Item>,
                render: () => <AuthorPublicationList authorId={authorId} publicationsYear={year}/>
            }
        });

        return (<Tab
            menu={{
            fluid: true,
            vertical: true,
            tabular: 'right'
        }}
            onTabChange={this.handleTabChange}
            panes={panes}/>);
    }
}

export default AuthorPublications;