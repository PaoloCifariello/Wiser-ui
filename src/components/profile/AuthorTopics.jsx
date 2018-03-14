import React, {Component} from 'react';
import {List} from 'semantic-ui-react'

import api from '../../api/api'

const normalizeEntityName = (entity_name) => entity_name
    .replace(/_/g, " ")
class AuthorTopics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authorTopics: []
        }
    }

    componentDidMount = () => {
        const {authorId} = this.props;

        api
            .getAuthorTopics(authorId)
            .then((res) => this.setState({authorTopics: res.data.topics}))
    }

    renderTopicsList = () => {
        const {authorTopics} = this.state;

        return authorTopics.slice(0, 29).map((topic, index) => <List.Item key={index}>{normalizeEntityName(topic.entity_name)}</ List.Item>)
    }

    render = () => {
        return (
            <List>{this.renderTopicsList()}</List >
        )
    }
}

export default AuthorTopics;