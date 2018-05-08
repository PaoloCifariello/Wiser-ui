import React, {Component} from 'react';
import {List} from 'semantic-ui-react'

import ReactTable from "react-table";
import "react-table/react-table.css";

import {range} from 'lodash';

import "./AuthorTopics.css"
import api from '../../api/api'
import {normalizeEntityName, renderAuthorEntityLink} from '../reusable/Entity'

class AuthorTopics extends Component {
    constructor(props) {
        super(props);
        const {authorInformation} = this.props;
        const authorYears = Object
            .keys(authorInformation.authorYears)
            .map((val) => parseInt(val, 10))
            .sort();

        this.state = {
            authorTopics: [],
            authorYears: range(authorYears[0], authorYears[authorYears.length - 1] + 1)
        }
    }

    componentDidMount = () => {
        const {authorId} = this.props.authorInformation;

        api
            .getAuthorTopics(authorId)
            .then(this.setAuthorTopicsImportance);
    }

    setAuthorTopicsImportance = (data) => {
        const authorTopics = data
            .topics
            .map((topic) => {
                topic["importance_score"] = Math.log(1 + (topic["document_count"] * Math.sqrt(topic["pr_score"]) * topic["iaf"]))
                return topic
            })
            .sort((topic1, topic2) => topic2["importance_score"] - topic1["importance_score"]);
        this.setState({authorTopics: authorTopics});
    }

    renderTopicsList = () => {
        const {authorTopics} = this.state;

        return authorTopics
            .slice(0, 29)
            .map((topic, index) => <List.Item key={index}>{normalizeEntityName(topic.entity_name)}</ List.Item>)
    }

    renderTopicYears = (topicYears) => {
        const {authorYears} = this.state;
        const singleYearWidth = 18 * Math.cos(50.0 * (Math.PI / 180)) + 40 * Math.cos(40.0 * (Math.PI / 180));

        return (
            <div
                style={{
                width: 28 * authorYears.length
            }}
                className="years-container">
                {authorYears.map((authorYear, _) => topicYears.some((topicYear, _) => topicYear === authorYear)
                    ? <div className="single-year-value year-present"/>
                    : <div className="single-year-value year-absent"/>)}
            </div>
        )
    }

    renderImportanceScoreCell = (prScore, maxPrScore) => {
        const percValue = (prScore / maxPrScore) * 100
        return (
            <div
                style={{
                width: '100%',
                height: '18px',
                backgroundColor: '#dadada',
                borderRadius: '2px'
            }}>
                <div
                    style={{
                    width: `${percValue}%`,
                    height: '100%',
                    backgroundColor: percValue > 66
                        ? '#85cc00'
                        : percValue > 33
                            ? '#ffbf00'
                            : '#ff2e00',
                    borderRadius: '2px',
                    transition: 'all .2s ease-out'
                }}/>
            </div>
        )
    }

    renderTopicYearsHeader = () => {
        const {authorYears} = this.state;

        return (
            <div
                className="years-container"
                style={{
                width: 27.5 * authorYears.length
            }}>
                {authorYears.map((year, _) => <div className="single-year-header">{year}</div>)}
            </div>
        )
    }

    renderTopicsTable = () => {
        const {authorTopics} = this.state;
        const {authorId} = this.props.authorInformation;
        const maxImportanceScore = authorTopics.length > 0
            ? authorTopics[0].importance_score
            : 1

        return <ReactTable
            data={authorTopics}
            columns={[
            {
                id: "entity_name",
                Header: "Entity",
                accessor: "entity_name",
                filterable: true,
                filterMethod: (filter, row) => normalizeEntityName(row[filter.id].toLowerCase()).indexOf(filter.value.toLowerCase()) !== -1,
                width: 200,
                Cell: ({original}) => renderAuthorEntityLink(authorId, original.entity_id, original.entity_name)
            }, {
                Header: "Count",
                accessor: "count",
                width: 60
            }, {
                Header: "Doc. count",
                accessor: "document_count",
                width: 80
            }, {
                Header: "Years",
                accessor: "years",
                sortable: false,
                filterable: true,
                Filter: () => this.renderTopicYearsHeader(),
                Cell: ({value}) => this.renderTopicYears(value)
            }, {
                Header: "Importance",
                accessor: "importance_score",
                width: 200,
                Cell: ({value}) => this.renderImportanceScoreCell(value, maxImportanceScore)
            }
        ]}
            defaultSorted={[{
                id: "importance_score",
                desc: true
            }
        ]}
            pageSizeOptions={[10, 15, 20, 30, 50]}
            defaultPageSize={15}
            className="-striped -highlight"/>
    }

    render = () => {
        return <div>
            {this.renderTopicsTable()}
        </div>
        // <List>{this.renderTopicsList()}</List > )
    }
}

export default AuthorTopics;