import React, {Component} from 'react';

import {Card, Rating} from 'semantic-ui-react'

import api from '../../api/api'
import {normalizeEntityName, computeEnttyReciaf} from '../reusable/Entity'

const TOP_K_TOPICS = 30;

class AuthorSurvey extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authorTopics: []
        }
    }
    componentDidMount = () => {
        const {authorId} = this.props.authorInformation;

        api
            .getAuthorTopics(authorId)
            .then((res) => {
                const authorTopics = res
                    .data
                    .topics
                    .map((topic) => {
                        topic["importance_score"] = Math.log(1 + computeEnttyReciaf(topic))
                        return topic
                    })
                    .sort((topic1, topic2) => topic2["importance_score"] - topic1["importance_score"])
                this.setState({authorTopics: authorTopics})
            });
    }

    renderAuthorTopic = ({entity_id, entity_name, document_count}) => {
        return <Card
            style={{
            width: "calc(25% - 14px)",
            minWidth: 150
        }}
            key={entity_id}>
            <Card.Content>
                <Card.Header>
                    <a target="_blank" href={`https://en.wikipedia.org/wiki/${entity_name}`}>{normalizeEntityName(entity_name)}</a>
                </Card.Header>
                <Card.Description><Rating maxRating={5} icon='star' size='massive'/></Card.Description>
            </Card.Content>
            <Card.Content extra>{`Appears in ${document_count} documents`}</Card.Content>
        </Card>
    }

    render = () => {
        const {authorTopics} = this.state;

        return (
            <Card.Group>
                {authorTopics
                    .slice(0, TOP_K_TOPICS)
                    .map(this.renderAuthorTopic)}
            </Card.Group>
        )
    }
}

export default AuthorSurvey;