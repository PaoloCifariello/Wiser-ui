import React, {Component} from 'react';
import {Card, Icon, List, Pagination} from 'semantic-ui-react'
import {NavLink} from 'react-router-dom'
import {Link} from 'react-router-dom'

import './PublicationList.css'

const PUBLICATIONS_PER_PAGE = 30;

class PublicationList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activePage: 1
        }
    }

    handlePaginationChange = (e, {activePage}) => this.setState({activePage})

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
        const publicationTitle = publication.title || publication.doi || publication.id;
        const publicationText = <div
            dangerouslySetInnerHTML={{
            __html: publication.text
        }}/>

        let currentPath = window
            .location
            .pathname
            .split('/')

        currentPath = currentPath.slice(0, currentPath.indexOf("publications") - currentPath.length);
        currentPath.push("publication", publication.id);

        const publicationLink = currentPath.join("/");

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
                    <div>
                        {publication.external_source
                            ? <div>External source</div>
                            : <div>ARPI</div>}
                    </div>
                </Card.Content>
            </Card>
        );
    }

    render = () => {
        const {activePage} = this.state;
        const {publications} = this.props;

        let startingElement = (activePage - 1) * PUBLICATIONS_PER_PAGE;
        return (
            <div>
                <List>
                    {publications
                        .slice(startingElement, startingElement + PUBLICATIONS_PER_PAGE)
                        .map((publication, index) => <List.Item key={index}>{this.renderPublication(publication)}</ List.Item>)}
                </List>
                <Pagination
                    secondary
                    pointing
                    activePage={activePage}
                    onPageChange={this.handlePaginationChange}
                    totalPages={Math.ceil(publications.length / PUBLICATIONS_PER_PAGE)}/>
            </div>
        );

    }

}

export default PublicationList;