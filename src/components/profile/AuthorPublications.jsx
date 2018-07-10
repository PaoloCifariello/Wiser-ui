import React, {Component} from 'react';
import {Dropdown, Label, Menu, Tab} from 'semantic-ui-react'

import PublicationList from '../reusable/PublicationList'

import './AuthorPublications.css'
import {normalizeEntityName} from '../reusable/Entity'

import api from '../../api/api'

class AuthorPublications extends Component {
    constructor(props) {
        super(props);
        const {authorId, authorYears} = this.props.authorInformation;
        const sortedAuthorYears = Object
            .keys(authorYears)
            .sort()
            .reverse();

        const entityIdFilter = this.props.match.params.entity_id_filter;

        this.state = {
            activeIndex: 0,
            authorId,
            authorTopics: [],
            sortedAuthorYears,
            authorPublications: [],
            filterTopics: entityIdFilter
                ? [parseInt(entityIdFilter, 10)]
                : []
        }
    }

    componentDidMount = () => {
        const {authorId} = this.state;

        Promise.all([
            api.getAuthorTopics(authorId),
            api.getAuthorPublications(authorId)
        ]).then((data) => {
            this.setState({authorTopics: data[0].topics, authorPublications: data[1].publications})
        });
    }

    handleTabChange = (e, {activeIndex}) => {
        this.setState({activeIndex})
    }

    changedFilterEntities = (event, {value}) => {
        this.setState({filterTopics: value})
    }

    renderEntityFilter = () => {
        const {authorTopics, filterTopics} = this.state;
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
            defaultValue={filterTopics}
            selection
            options={options}/>);
    }

    filterAuthorPublications = () => {
        const {authorPublications, filterTopics} = this.state

        const filteredPublications = authorPublications.filter((publication) => filterTopics.every((filterTopic) => publication.entities.some((entity) => filterTopic === entity.entity_id)));

        return filteredPublications.reduce((publicationsMap, publication) => {
            const publicationYear = publication.year,
                yearPublications = publicationsMap.get(publicationYear);

            if (yearPublications) {
                yearPublications.push(publication)
                publicationsMap.set(publicationYear, yearPublications)
            } else {
                publicationsMap.set(publicationYear, [publication])
            }

            return publicationsMap;
        }, new Map());
    }

    renderYearsTab = () => {
        const {activeIndex} = this.state

            const publicationsMap = this.filterAuthorPublications(),
                years = Array
                    .from(publicationsMap.keys())
                    .sort()
                    .reverse()

            const panes = years.map((year, index) => {
                return {
                    menuItem: <Menu.Item key={year}>
                        <Label
                            circular
                            color={activeIndex === index
                            ? "teal"
                            : "grey"}>{publicationsMap
                                .get(year)
                                .length}</Label>{year}</Menu.Item>,
                    render: () => <PublicationList
                            publicationsYear={year}
                            publications={publicationsMap.get(year)}/>
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