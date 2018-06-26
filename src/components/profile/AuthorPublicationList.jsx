import React, {Component} from 'react';
import {Card, Icon, List} from 'semantic-ui-react'
import {NavLink} from 'react-router-dom'
import {Link} from 'react-router-dom'

import './AuthorPublicationList.css'
class AuthorPublicationList extends Component {

    renderPublicationAuthor = (author) => {
        const profileLink = `/profile/${author.author_id}`;

        return (
            <Link to={profileLink}>
                {author.author_name}
            </Link>
        )
    }

    getPublicationMeta = (publication) => {
        return (
            <span>{publication
                    .authors
                    .map((author, index) => <span key={index}>
                        {this.renderPublicationAuthor(author)}
                    </span>)}</span>
        );
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
                <Card.Content>
                    <Card.Header as={NavLink} to={publicationLink}>
                        {publicationTitle}
                    </ Card.Header >
                    <Card.Meta>
                        {this.getPublicationMeta(publication)}
                    </Card.Meta >
                </Card.Content>
                <Card.Content description={publicationText}/>
                <Card.Content as={NavLink} to={publicationLink} extra>
                    <div>
                        <Icon className="padding0" name='unordered list'/> {` ${publication.entities.length} Topics`}
                    </div>
                    <div>
                        {publication.translated
                            ? <div><Icon name="language"/>Translated</div>
                            : null}
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