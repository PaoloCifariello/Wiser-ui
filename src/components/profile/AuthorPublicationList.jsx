import React, {Component} from 'react';
import {Card, Icon, List} from 'semantic-ui-react'
import {NavLink} from 'react-router-dom'
import './AuthorPublicationList.css'

import api from '../../api/api'

class AuthorPublicationList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authorPublications: []
        }
    }

    componentDidMount = () => {
        const {authorId, publicationsYear} = this.props;

        api
            .getAuthorPublications(authorId, publicationsYear)
            .then((res) => this.setState({authorPublications: res.data.publications}))
    }

    componentWillReceiveProps = ({publicationsYear}) => {
        if (this.props.publicationsYear !== publicationsYear) {
            this.setState({authorPublications: []});
        }
    }

    componentDidUpdate = (prevProps) => {
        const {authorId, publicationsYear} = this.props;

        if (prevProps.publicationsYear !== this.props.publicationsYear) {
            api
                .getAuthorPublications(authorId, publicationsYear)
                .then((res) => this.setState({authorPublications: res.data.publications}))
        }
    }

    renderPublication = (publication) => {
        const {authorId} = this.props;

        const publicationTitle = publication.title || publication.doi || publication.id;
        const publicationText = <div
            dangerouslySetInnerHTML={{
            __html: publication.text
        }}/>
        const publicationLink = `/profile/${authorId}/publication/${publication.id}`;
        return (
            <Card className="margin-bottom-10" fluid>
                <Card.Content as={NavLink} to={publicationLink} header={publicationTitle}/>
                <Card.Content description={publicationText}/>
                <Card.Content as={NavLink} to={publicationLink} extra>
                    <div>
                        <Icon className="padding0" name='unordered list'/> {` ${publication.entities.length} Topics`}
                    </div>
                </Card.Content>
            </Card>
        );
    }

    render = () => {
        const {filterTopics} = this.props;
        var {authorPublications} = this.state;

        if (filterTopics.length > 0) {
            authorPublications = authorPublications.filter((publication) => publication.entities.some((entity) => filterTopics.includes(entity.entity_id)))

        }
        return authorPublications.map((publication, index) => <List.Item key={index}>{this.renderPublication(publication)}</ List.Item>)
    }

}

export default AuthorPublicationList;