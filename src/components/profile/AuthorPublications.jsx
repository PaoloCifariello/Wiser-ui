import React, {Component} from 'react';
import {Dropdown, Label, Menu, Tab} from 'semantic-ui-react'

import AuthorPublicationList from './AuthorPublicationList'

import './AuthorPublications.css'
import {normalizeEntityName} from '../reusable/Entity'

import api from '../../api/api'
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
            authorTopics: [],
            sortedAuthorYears,
            filterByTopics: []
        }
    }

    componentDidMount = () => {
        const {authorId} = this.state;

        api
            .getAuthorTopics(authorId)
            .then((res) => {
                this.setState({authorTopics: res.data.topics})
            });
    }

    handleItemClick = (e, {year}) => this.setState({selectedYear: year})
    handleTabChange = (e, {activeIndex}) => {
        this.setState({activeIndex})
    }

    changedFilterEntities = (event, {value}) => {
        this.setState({
            filterByTopics: value
        })
    }

    renderEntityFilter = () => {
        const {authorTopics} = this.state;
        const options = authorTopics.map((topic) => {
            return {
                key: topic.entity_id,
                value: topic.entity_id,
                text: normalizeEntityName(topic.entity_name)
            }
        });
        return (<Dropdown
            placeholder='Filter by topics'
            onChange={this.changedFilterEntities}
            deburr
            fluid
            multiple
            search
            selection
            options={options}/>);
    }

    renderYearsTab = () => {
        const {authorId, activeIndex, authorYears, authorTopics, sortedAuthorYears, filterByTopics} = this.state

        var years = sortedAuthorYears;
        if (filterByTopics.length > 0) {
            const selectedFiltertopics = authorTopics.filter((topic) => filterByTopics.includes(topic.entity_id));
            years = [...new Set(selectedFiltertopics.reduce((years, topic) => years.concat(topic.years), []))].sort().reverse();
        }
        

        const panes = years.map((year, index) => {
            return {
                menuItem: <Menu.Item key={year}>
                    <Label
                        circular
                        color={activeIndex === index
                        ? "teal"
                        : "grey"}>{authorYears[year]}</Label>{year}</Menu.Item>,
                render: () => <AuthorPublicationList authorId={authorId} publicationsYear={year} filterTopics={filterByTopics} />
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

    render = () => {
        return (
            <div>
                {this.renderEntityFilter()}
                <div style={{
                    height: 20
                }}/> {this.renderYearsTab()}

            </div>
        );
    }
}

export default AuthorPublications;