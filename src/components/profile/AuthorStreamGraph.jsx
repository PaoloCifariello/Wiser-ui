import React, {PureComponent} from 'react';
import {Divider, Message} from 'semantic-ui-react';

import api from '../../api/api'
import {normalizeEntityName} from '../reusable/Entity'

import StreamGraph from '../reusable/StreamGraph'

const getHelpMessage = (props) => (
    <Message compact {...props}>
        <Message.Content>
            The <b>Stream graph</b> is a chart showing the <i>main topics</i> of interest of an author among time. It is
            particularly useful to identify changes in the fileds of study. You can interact
            with the chart by modifying two fields:
            <Message.List>
                <Message.Item>
                    <b>Range of years</b> - to rule how long is a period of time in which the author treats certain topics. Lower values increase the granularity and therefore includes more topics. Higher values tends to consider less topics.
                </Message.Item>
                <Message.Item>
                    <b>Topics per year</b> - to rule how many topics to consider for each period of time. Lower values to include less topics, higher values to include more.
                </Message.Item>
            </Message.List>
        </Message.Content>
    </Message>
);

class AuthorStreamGraph extends PureComponent {
    constructor(props) {
        super(props);
        const {authorInformation} = this.props;

        this.state = {
            helpMessageVisible: true,
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

    onDismissHelpMessage = () => {
        this.setState({helpMessageVisible: false});
    }

    renderHelpMessage = () => {
        const {helpMessageVisible} = this.state;

        if (helpMessageVisible) 
            return (
                <div>
                    {getHelpMessage({onDismiss: this.onDismissHelpMessage})}
                    <Divider hidden/>
                </div>
            );
    }
    
    render = () => {
        const {authorTopics, authorYears} = this.state;

        return (
            <div>
                {this.renderHelpMessage()}
                <div>
                    <StreamGraph topics={authorTopics} years={authorYears}/>
                </div>
            </div>
        );
    }
}

export default AuthorStreamGraph;