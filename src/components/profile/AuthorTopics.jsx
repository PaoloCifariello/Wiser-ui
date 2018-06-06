import React, {Component} from 'react';

import ReactTable from "react-table";
import "react-table/react-table.css";

import EntityLink from "../reusable/EntityLink"

import {range} from 'lodash';

import "./AuthorTopics.css"
import api from '../../api/api'
import {normalizeEntityName} from '../reusable/Entity'
import {inRange} from '../reusable/Util'

class AuthorTopics extends Component {
    constructor(props) {
        super(props);
        const {authorInformation} = this.props;
        let authorYears = Object
            .keys(authorInformation.authorYears)
            .map((val) => parseInt(val, 10))
            .sort();

        this.state = {
            authorTopics: [],
            authorYears: this.generateAuthorYears(authorYears)
        }
    }

    generateAuthorYears = (authorYears) => {
        authorYears = range(authorYears[0], authorYears[authorYears.length - 1] + 1);
        if (authorYears.length > 12) {
            let oldYearsGranularity = Math.floor((authorYears.length - 6) / 6);
            let recentYears = authorYears
                .slice(-6)
                .map((year, _) => {
                    return {from: year, to: year}
                })

            let oldYears = []

            let currentYear = authorYears[authorYears.length - 7];

            for (var i = 0; i < 5; i++) {
                oldYears.push({
                    from: currentYear - oldYearsGranularity + 1,
                    to: currentYear
                });

                currentYear -= oldYearsGranularity
            }
            oldYears.push({from: authorYears[0], to: currentYear})

            return oldYears
                .reverse()
                .concat(recentYears);

        } else {
            return authorYears.map((year, _) => {
                return {from: year, to: year}
            })
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
            .map((topic) => Object.defineProperty(topic, "importance_score", {
                // value: Math.log(1 + (topic["document_count"]) * Math.sqrt(topic["pr_score"]) * topic["iaf"])
                value: Math.log(1 + (topic["document_count"]) * Math.sqrt(topic["pr_score"]) * topic["iaf"])
            }))
            .sort((topic1, topic2) => topic2["importance_score"] - topic1["importance_score"])
            .map((topic, index) => Object.defineProperty(topic, 'importance_rank', {
                value: index + 1
            }));
        this.setState({authorTopics: authorTopics});
    }

    renderTopicYears = (topicYears) => {
        const {authorYears} = this.state;
        const singleYearWidth = 18 * Math.cos(50.0 * (Math.PI / 180)) + 40 * Math.cos(40.0 * (Math.PI / 180));

        return (
            <div
                style={{
                width: 33 * authorYears.length
            }}
                className="years-container">
                {authorYears.map(({
                    from,
                    to
                }, index) => topicYears.some((topicYear, _) => inRange(topicYear, from, to))
                    ? <div key={index} className="single-year-value year-present"/>
                    : <div key={index} className="single-year-value year-absent"/>)}
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
                width: 33 * authorYears.length
            }}>
                {authorYears.map(({
                    from,
                    to
                }, index) => from === to
                    ? <div key={index} className="single-year-header">{from}</div>
                    : <div key={index} className="single-year-header">{from}<br/>{to}</div>)}
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
                Header: "Rank",
                accessor: "importance_rank",
                width: 40
            }, {
                id: "entity_name",
                Header: "Entity",
                accessor: "entity_name",
                filterable: true,
                filterMethod: (filter, row) => normalizeEntityName(row[filter.id].toLowerCase()).indexOf(filter.value.toLowerCase()) !== -1,
                width: 200,
                Cell: ({original}) => <EntityLink
                        authorId={authorId}
                        entityId={original.entity_id}
                        entityName={original.entity_name}/>
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
                Cell: ({value}) => this.renderTopicYears(value),
                minWidth: 400
            }, {
                Header: "Importance",
                accessor: "importance_score",
                Cell: ({value}) => this.renderImportanceScoreCell(value, maxImportanceScore),
                minWidth: 150,
                maxWidth: 300
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
    }
}

export default AuthorTopics;