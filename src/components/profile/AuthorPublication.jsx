import React, {Component} from 'react';
import {
    Card,
    Dimmer,
    Divider,
    Header,
    Icon,
    Image,
    Loader,
    Segment
} from 'semantic-ui-react'

import ReactTable from "react-table";
import "react-table/react-table.css";
import api from '../../api/api'
import {renderEntityLink} from '../reusable/Entity';

const shortParagraphImage = './shortParagraphImage.png';


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

    renderPublicationText = () => {
        const {publication} = this.state;

        const publicationTitle = publication.title || publication.doi || publication.id;
        const publicationText = <div
            dangerouslySetInnerHTML={{
            __html: publication.text
        }}/>

        return (
            <Card className="margin-bottom-10" fluid>
                <Card.Content header={publicationTitle}/>
                <Card.Content description={publicationText}/>
                <Card.Content extra>
                    <div>
                        <Icon className="padding0" name='unordered list'/> {` ${publication.clean_entities.length} Topics`}
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
                        : '#ffbf00',
                    transition: 'all .3s ease'
                }}>
                    &#x25cf;
                </span>
                {row.value === 1
                    ? 'Wrong annotation'
                    : 'Not pertinent'}
            </span>
        )
    }

    renderFilteredTopicsTable = () => {
        const {filtered_entities} = this.state.publication;

        return <div>
            <Header>Filtered topics  ({filtered_entities.length})</Header>
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
        const {clean_entities} = this.state.publication;

        return <div>
            <Header>Topics ({clean_entities.length})</Header>
            <ReactTable
                data={clean_entities}
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

    renderLoading = () => {
        return (
            <Segment>
                <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                </Dimmer>

                <Image src={shortParagraphImage}/>
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
                    <Divider/> {this.renderFilteredTopicsTable()}
                </div>
            );
        else 
            return <div></div>;
        }
    }

export default AuthorPublication