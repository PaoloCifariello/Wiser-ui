import React, {PureComponent} from 'react';

import api from '../../api/api'
import {normalizeEntityName} from '../reusable/Entity'

import StreamGraph from '../reusable/StreamGraph'

class AuthorStreamGraph extends PureComponent {
    constructor(props) {
        super(props);
        const {authorInformation} = this.props;

        this.state = {
            authorYears: Object
                .keys(authorInformation.authorYears)
                .map((val) => parseInt(val, 10))
                .sort(),
            authorTopics: []
        }
    }

    componentDidMount = () => {
        const {authorId} = this.props.authorInformation;

        api
            .getAuthorTopics(authorId)
            .then(this.setAuthorTopicsState)
    }

    setAuthorTopicsState = (data) => {
        this.setState({
            authorTopics: data
                .topics
                .map((entity) => ({
                    entity_name: normalizeEntityName(entity.entity_name),
                    entity_id: entity.entity_id,
                    reciaf: entity.reciaf,
                    distribution: entity.distribution,
                    years: entity.years
                }))
        })

    }

    render = () => {
        const {authorTopics, authorYears} = this.state;

        return (<StreamGraph topics={authorTopics} years={authorYears}/>);
    }
}

export default AuthorStreamGraph;