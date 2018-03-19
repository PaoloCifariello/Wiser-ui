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
            .then((res) => this.setState({authorTopics: res.data.topics}))
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
        const maxPrScore = authorTopics.length > 0
            ? authorTopics[0].pr_score
            : 1

        return <ReactTable
            data={authorTopics}
            columns={[
            {
                id: "entity_name",
                Header: "Entity",
                accessor: "entity_name",
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
                accessor: "pr_score",
                width: 250,
                Cell: ({value}) => this.renderImportanceScoreCell(value, maxPrScore)
            }
        ]}
            defaultSorted={[{
                id: "pr_score",
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