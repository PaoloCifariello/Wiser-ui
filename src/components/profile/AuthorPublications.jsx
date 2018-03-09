import React, {Component} from 'react';
import {Card, Icon, List} from 'semantic-ui-react'

import api from '../../api/api'

import './AuthorPublications.css'

class AuthorPublications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authorId: this.props.authorId,
            authorPublications: []
        }
    }

    componentDidMount = () => {
        const {authorId} = this.state;

        api
            .getAuthorPublications(authorId)
            .then((res) => this.setState({authorPublications: res.data.publications}))
    }

    renderPublication = (publication) => {
        const publicationText = <div dangerouslySetInnerHTML={{__html: publication.text}} />
        return (
            <Card fluid>
                <Card.Content header={publication.doi || publication.id}/>
                <Card.Content description={publicationText} />
                <Card.Content extra>
                    <div>
                        <Icon className="padding0" name='unordered list'/> {` ${publication.entities.length} Topics`}
                    </div>
                </Card.Content>
            </Card>
        );
    }
    renderPublicationsList = () => {
        const {authorPublications} = this.state;

        return authorPublications.map((publication, index) => <List.Item key={index}>{this.renderPublication(publication)}</ List.Item>)
    }

    render = () => {
        return (
            <List>{this.renderPublicationsList()}</List >
        )
    }
}

export default AuthorPublications;