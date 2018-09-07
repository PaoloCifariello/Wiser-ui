import React, {Component} from 'react';
import {Card, List} from 'semantic-ui-react'

import {Link} from 'react-router-dom';
import EntityLink from "../reusable/EntityLink"
import AuthorRole from '../reusable/AuthorRole'

import api from '../../api/api'

const getAuthorSurname = (authorFullName) => authorFullName.split(" ").pop();

class DepartmentAuthors extends Component {
    constructor(props) {
        super(props);

        this.state = {
            departmentAuthors: []
        };
    }

    componentDidMount = () => {
        const {departmentName} = this.props.match.params;
        
        api
            .getDepartmentAuthors(departmentName)
            .then(this.setDepartmentAuthors);
    }

    setDepartmentAuthors = (data) => {
        this.setState({ 
            departmentAuthors: data
                .department_authors
                .sort((a, b) => getAuthorSurname(a.name).localeCompare(getAuthorSurname(b.name)))
        });
    }

    renderProfile = (author) => {
        const profileLink = `/profile/${author.author_id}`;

        return (
            <Link to={profileLink}>
                <Card className="modal-author-card">
                    <Card.Content>
                        <Card.Header>
                            {author.name}
                        </Card.Header>
                        <Card.Description>
                            <List>
                                {author
                                    .top_entities
                                    .slice(0, 3)
                                    .map((entity, i) => <List.Item key={i}>
                                        <EntityLink
                                            link={false}
                                            authorId={author.author_id}
                                            entityId={entity.entity_id}
                                            entityName={entity.entity_name}/>
                                    </List.Item>)}
                            </List>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <AuthorRole role={author.role} />
                    </ Card.Content>
                </Card>
            </Link>
        );
    }

    render = () => {
        const {departmentAuthors} = this.state;

        return <Card.Group>
            {departmentAuthors.map((author, i) => <List.Item key={i}>
                {this.renderProfile(author)}
            </List.Item>)}
        </Card.Group>
    }
}

export default DepartmentAuthors;