import React, {Component} from 'react';
import {Card, Icon, List} from 'semantic-ui-react'
import {NavLink} from 'react-router-dom'
import './AuthorPublicationList.css'

class AuthorPublicationList extends Component {
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
        const {authorPublications} = this.props;
        return authorPublications.map((publication, index) => <List.Item key={index}>{this.renderPublication(publication)}</ List.Item>)
    }

}

export default AuthorPublicationList;