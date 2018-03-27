import React, {Component} from 'react';
import {List} from 'semantic-ui-react'

import ReactTable from "react-table";
import "react-table/react-table.css";

import "./AuthorTopics.css"
import api from '../../api/api'
import {normalizeEntityName, renderEntityLink} from '../reusable/Entity'

class AuthorTopics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authorTopics: []
        }
    }

    componentDidMount = () => {
        const {authorId} = this.props.authorInformation;

        api
            .getAuthorTopics(authorId)
            .then((res) => {
                const authorTopics = res
                    .data
                    .topics
                    .map((topic) => {
                        topic["importance_score"] = Math.log(1 + (topic["document_count"] * Math.sqrt(topic["pr_score"]) * topic["iaf"]))
                        return topic
                    })
                    .sort((topic1, topic2) => topic2["importance_score"] - topic1["importance_score"]);
                this.setState({authorTopics: authorTopics});
            })
    }

    renderTopicsList = () => {
        const {authorTopics} = this.state;

        return authorTopics
            .slice(0, 29)
            .map((topic, index) => <List.Item key={index}>{normalizeEntityName(topic.entity_name)}</ List.Item>)
    }

    renderTopicYears = (years) => {
        return years
            .sort()
            .join(" - ");
    }

    renderImportanceScoreCell = (prScore, maxPrScore) => {
        const percValue = (prScore / maxPrScore) * 100
        return (
            <div
                style={{
                width: '100%',
                height: '100%',
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

    renderTopicsTable = () => {
        const {authorTopics} = this.state;
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
                width: 250,
                Cell: ({value}) => renderEntityLink(value)
            }, {
                Header: "Count",
                accessor: "count",
                width: 80
            }, {
                Header: "Document count",
                accessor: "document_count",
                width: 120
            }, {
                Header: "Years",
                accessor: "years",
                sortable: false,
                Cell: ({value}) => this.renderTopicYears(value)
            }, {
                Header: "Importance",
                accessor: "importance_score",
                width: 250,
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