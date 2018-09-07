import React, {Component} from 'react';
import {Card, List, Modal} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import EntityLink from "../reusable/EntityLink"

import AuthorRole from '../reusable/AuthorRole'

import api from '../../api/api';
import './ModalAuthorList.css';

class ModalAuthorList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            authorProfiles: null
        };
    }

    setAuthorNames = ({author_profiles}) => {
        this.setState({authorProfiles: author_profiles})
    }

    retrieveAuthorNames = (authors) => {
        api
            .getAuthorProfiles(authors)
            .then(this.setAuthorNames);
    }

    // componentDidMount = () => {     const {authors} = this.props;
    // console.log("mount");     console.log(authors); }

    componentDidUpdate = (prevProps) => {
        const {authors} = this.props;

        if (prevProps.authors !== authors && authors.length > 0) {
            this.retrieveAuthorNames(authors);
        }
    }

    componentWillReceiveProps = () => {}

    onClose = () => {
        const {closeAuthorAreaList} = this.props;

        this.setState({authorProfiles: null})
        closeAuthorAreaList();
    }

    renderProfile = (authorId) => {
        const {authorProfiles} = this.state,
            author = authorProfiles[authorId],
            profileLink = `/profile/${authorId}`;

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
                                            authorId={authorId}
                                            entityId={entity.entity_id}
                                            entityName={entity.entity_name}/>
                                    </List.Item>)}
                            </List>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <AuthorRole role={author.role}/>
                    </ Card.Content>
                </Card>
            </Link>
        );
    }

    renderAuthorList = () => {
        const {authors} = this.props;
        const {authorProfiles} = this.state;

        if (!authorProfiles) 
            return;
        
        return (
            <Card.Group>
                {authors.map((authorId, i) => <List.Item key={i}>
                    {this.renderProfile(authorId)}
                </List.Item>)}
            </Card.Group>
        );

    }

    render = () => {
        const {open, authors} = this.props;
        // const {showAuthorAreaList, selectedAreaId, departmentAreas} = this.state;
        if (authors === undefined) {
            return null;
        }

        return (
            <Modal
                className="scrolling"
                open={open}
                closeOnEscape={true}
                closeOnRootNodeClick={true}
                onClose={this.onClose}
                size={'large'}>
                <Modal.Header>Associated authors</Modal.Header>
                <Modal.Content className="modal-content-scrolling-bugfix" scrolling>
                    <Modal.Description>
                        {this.renderAuthorList()}
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        )
    }
}

export default ModalAuthorList;