import React, {Component} from 'react';
import {
    Card,
    Dimmer,
    Divider,
    Header,
    Icon,
    Loader,
    Segment
} from 'semantic-ui-react'

import ReactTable from "react-table";
import "react-table/react-table.css";
import api from '../../api/api'
import {renderEntityLink} from '../reusable/Entity';

import './AuthorPublication.css'

class AuthorPublication extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount = () => {
        const {publicationId} = this.props.match.params;

        api
            .getAuthorPublication(publicationId)
            .then((res) => this.setState({publication: res.data}))
    }

    componentDidUpdate = () => {
        const {filtered_entities} = this.state.publication;
        const annotations = document.querySelectorAll('.annotation');

        annotations.forEach((annotation) => {
            const annotationName = annotation.getAttribute('entity');
            const fe = filtered_entities.find((el) => el.entity_name === annotationName);
            if (fe) {
                annotation.setAttribute("class", `annotation annotation-filtered-${fe.filtered}`)
            } else {
                annotation.setAttribute("class", `annotation annotation-clean`)
            }
        })
    }

    renderPublicationText = () => {
        const {publication} = this.state;

        const publicationTitle = publication.title || publication.doi || publication.id;
        const publicationText = <div
            dangerouslySetInnerHTML={{
            __html: publication.text
        }}/>

        return (
            <Card className="margin-bottom-10" fluid>
                <Card.Content>
                    <Card.Header>
                        {publicationTitle}
                    </Card.Header>
                    <Card.Meta>
                        <span>{publication.year}</span>
                    </Card.Meta>
                </Card.Content>
                <Card.Content description={publicationText}/>
                <Card.Content extra>
                    <div>
                        <Icon className="padding0" name='unordered list'/> {` ${publication.clean_entities.length} Topics (${publication.filtered_entities.length} filtered)`}
                    </div>
                </Card.Content>
            </Card>
        );
    }

    renderFilteredCause = row => {
        return (
            <span>
                <span
                    style={{
                    color: row.value === 1
                        ? '#ff2e00'
                        : row.value === 2
                            ? '#ffbf00'
                            : "#57d500",
                    transition: 'all .3s ease'
                }}>
                    &#x25cf;
                </span>
                {row.value === 1
                    ? ' Wrong annotation, because of a small ρ'
                    : row.value === 2
                        ? ' Not pertinent, because of a zero centrality'
                        : " Good"}
            </span>
        )
    }

    renderFilteredTopicsTable = () => {
        const {filtered_entities} = this.state.publication;

        return <div>
            <Header>Filtered topics ({filtered_entities.length})</Header>
            <ReactTable
                data={filtered_entities}
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
                    Header: "Filtered",
                    accessor: "filtered",
                    width: 300,
                    Cell: this.renderFilteredCause
                }
            ]}
                defaultSorted={[{
                    id: "count",
                    desc: true
                }
            ]}
                pageSizeOptions={[5, 10, 15, 20, 30]}
                defaultPageSize={10}
                className="-striped -highlight"/>
        </div>
    }

    renderTopicsTable = () => {
        const {clean_entities, filtered_entities} = this.state.publication;

        return <div>
            <Header>Topics</Header>
            <ReactTable
                data={clean_entities.concat(filtered_entities)}
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
                    Header: "Filtered",
                    accessor: "filtered",
                    width: 300,
                    Cell: this.renderFilteredCause
                }
            ]}
                defaultSorted={[{
                    id: "count",
                    desc: true
                }
            ]}
                pageSizeOptions={[10, 15, 20, 30, 40]}
                defaultPageSize={15}
                className="-striped -highlight"/>
        </div>
    }

    renderLoading = () => {
        return (
            <Segment>
                <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                </Dimmer>
            </Segment>
        );
    }
    render = () => {
        const {publication} = this.state;

        if (publication) 
            return (
                <div>
                    {this.renderPublicationText()}
                    <Divider/> {this.renderTopicsTable()}
                </div>
            );
        else 
            return <div></div>;
        }
    }

export default AuthorPublication