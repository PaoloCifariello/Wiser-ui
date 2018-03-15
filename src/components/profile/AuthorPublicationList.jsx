import React, {Component} from 'react';
import {Card, Icon, List} from 'semantic-ui-react'

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
        if (this.props.publicationsYear !== publicationsYear) 
            this.setState({authorPublications: []});
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
        const publicationText = <div
            dangerouslySetInnerHTML={{
            __html: publication.text
        }}/>
        return (
            <Card className="margin-bottom-10" fluid>
                <Card.Content header={publication.doi || publication.id}/>
                <Card.Content description={publicationText}/>
                <Card.Content extra>
                    <div>
                        <Icon className="padding0" name='unordered list'/> {` ${publication.entities.length} Topics`}
                    </div>
                </Card.Content>
            </Card>
        );
    }

    render = () => {
        const {authorPublications} = this.state;
        return authorPublications.map((publication, index) => <List.Item key={index}>{this.renderPublication(publication)}</ List.Item>)
    }

}

export default AuthorPublicationList;