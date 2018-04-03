import React, {Component} from 'react';

import {
    Button,
    Card,
    Divider,
    Message,
    Rating,
    Statistic
} from 'semantic-ui-react'

import api from '../../api/api'
import {normalizeEntityName} from '../reusable/Entity'

const TOP_K_TOPICS = 30;

class AuthorSurvey extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authorTopics: [],
            showMessage: false,
            rates: new Map()
        }
    }
    componentDidMount = () => {
        const {authorId} = this.props.authorInformation;

        api
            .getAuthorTopicsForSurvey(authorId)
            .then(this.setAuthorTopics)
            .catch(this.showErrorMessage)
    }

    setAuthorTopics = (data) => {
        this.setState({authorTopics: data.topics})
    }

    rateTopic = (entityId, rate) => {
        const {rates} = this.state;
        rates.set(entityId, rate)
        this.setState({rates})
    }

    showSuccessfulMessage = (content) => {
        this.setState({
            showMessage: true,
            message: {
                type: "positive",
                text: content.message
            }
        })
    }

    showErrorMessage = (content) => {
        this.setState({
            showMessage: true,
            message: {
                type: "negative",
                text: content.message
            }
        })
    }

    saveRates = () => {
        const {authorId} = this.props.authorInformation;
        const {rates} = this.state;
        const obj = {};
        rates.forEach((v, k) => {
            obj[k] = v
        });
        api
            .submitSurvey(authorId, obj)
            .then(this.showSuccessfulMessage)
            .catch(this.showErrorMessage)
            // TODO: const {rates} = this.state; code to save rates formate rates (if
            // needed) into some JSON and send to server api.saveRates(rates)
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
                <Card.Description><Rating
                    maxRating={5}
                    icon='star'
                    size='massive'
                    onRate={(e, {rating}) => this.rateTopic(entity_id, rating)}/></Card.Description>
            </Card.Content>
            <Card.Content extra>{`Appears in ${document_count} documents`}</Card.Content>
        </Card>
    }
    renderSurvey = () => {
        const {authorTopics, rates} = this.state;

        return (
            <div>
                <Message>
                    <Message.Header>Survey.</Message.Header>
                    <Message.Content>
                        Please rate the following topics based on their pertinence to author's research.
                        For each topic, you have to choose a rate from&nbsp;
                        <Rating icon='star' disabled defaultRating={1} maxRating={1}/>
                        (low pertinence) to&nbsp;
                        <Rating icon='star' disabled defaultRating={5} maxRating={5}/>
                        (high pertinence) and then save your feedback.
                    </Message.Content>
                </Message>
                <Card.Group>
                    {authorTopics.map(this.renderAuthorTopic)}
                </Card.Group>
                <Divider horizontal/>
                <Divider horizontal/>
                <div className="align-center">
                    <div>
                        <Button color='teal' size='big' onClick={this.saveRates}>Save</Button>
                        <Statistic
                            style={{
                            marginLeft: 15
                        }}
                            size='tiny'
                            label='Rates'
                            value={`${rates.size}/${TOP_K_TOPICS}`}/>
                    </div>
                </div>
            </div>
        )
    }

    renderMessage = () => {
        const {message} = this.state;

        return (
            <Message
                positive={message.type === "positive"}
                negative={message.type === "negative"}>
                <Message.Header>
                    {message.type === "positive"
                        ? "Success"
                        : "Error"}
                </Message.Header>
                <p>{message.text}</p>
            </Message>
        )
    }

    render = () => {
        const {showMessage} = this.state;

        return showMessage
            ? this.renderMessage()
            : this.renderSurvey();

    }
}

export default AuthorSurvey;