import React, {Component} from 'react';

import {TagCloud} from 'react-tagcloud'

import api from '../../api/api'

class AuthorWordcloud extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authorId: this.props.authorId,
            authorTopics: []
        }
    }

    componentDidMount = () => {
        const {authorId} = this.state;

        api
            .getAuthorTopics(authorId)
            .then((res) => this.setState({
                authorTopics: res
                    .data
                    .topics
                    .map((topic) => {
                        return {value: topic.entity_name, count: topic.pr_score}
                    })
            }))
    }

    render = () => {
        const {authorTopics} = this.state;

        return (<TagCloud minSize={15} maxSize={30} tags={authorTopics.slice(0, 20)}/>);
    }
}

export default AuthorWordcloud;