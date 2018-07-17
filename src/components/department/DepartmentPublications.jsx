import React, {Component} from 'react';
import {Dropdown, Label, Menu, Tab} from 'semantic-ui-react'

import PublicationList from '../reusable/PublicationList'

import {normalizeEntityName} from '../reusable/Entity'

import api from '../../api/api'

class DepartmentPublications extends Component {
    constructor(props) {
        super(props);
        const {departmentName, departmentYears} = this.props.departmentInformation;
        const sortedDepartmentYears = Object
            .keys(departmentYears)
            .sort()
            .reverse();

        const entityIdFilter = this.props.match.params.entity_id_filter;
        this.state = {
            activeIndex: 0,
            departmentName,
            departmentTopics: [],
            sortedDepartmentYears,
            publicationsDistribution: departmentYears,
            departmentPublications: [],
            filterTopics: entityIdFilter
                ? [parseInt(entityIdFilter, 10)]
                : []
        }
    }

    componentDidMount = () => {
        const {activeIndex, departmentName, sortedDepartmentYears} = this.state,
            selectedYear = sortedDepartmentYears[activeIndex];
        Promise.all([
            api.getDepartmentTopics(departmentName),
            api.getDepartmentPublications(departmentName, selectedYear)
        ]).then((data) => this.setState({departmentTopics: data[0].topics, departmentPublications: data[1].publications}));
    }

    componentDidUpdate = (_, prevState) => {
        if (prevState.activeIndex !== this.state.activeIndex) {
            const {activeIndex, departmentName, sortedDepartmentYears} = this.state,
                selectedYear = sortedDepartmentYears[activeIndex];
            api
                .getDepartmentPublications(departmentName, selectedYear)
                .then((data) => this.setState({departmentPublications: data.publications}))
        }
    }

    handleTabChange = (e, {activeIndex}) => {
        this.setState({activeIndex, departmentPublications: []})
    }

    changedFilterEntities = (event, {value}) => {
        this.setState({filterTopics: value})
    }

    renderEntityFilter = () => {
        const {departmentTopics, filterTopics} = this.state;
        const options = departmentTopics.map((topic) => {
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

    filterPublications = () => {
        const {departmentPublications, filterTopics} = this.state,
            filteredPublications = departmentPublications.filter((publication) => filterTopics.every((filterTopic) => publication.entities.some((entity) => filterTopic === entity.entity_id)));

        return filteredPublications;
    }

    renderYearsTab = () => {
        const {activeIndex, sortedDepartmentYears, publicationsDistribution} = this.state

        const filteredPublications = this.filterPublications();

        const panes = sortedDepartmentYears.map((year, index) => {
            return {
                menuItem: <Menu.Item key={year}>
                    <Label
                        circular
                        color={activeIndex === index
                        ? "teal"
                        : "grey"}>{publicationsDistribution[year]}</Label>{year}</Menu.Item>,
                render: () => <PublicationList publicationsYear={year} publications={filteredPublications}/>
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
                {/* {this.renderEntityFilter()} */}
                <div style={{
                    height: 20
                }}/> {this.renderYearsTab()}

            </div>
        );
    }
}

export default DepartmentPublications;