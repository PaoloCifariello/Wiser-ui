import {range} from 'lodash';
import React, {Component} from 'react';
import {Card, Form, Select} from 'semantic-ui-react';
import api from '../../api/api';
import {BubbleChart} from "../reusable/BubbleChart";
import {normalizeEntityName} from '../reusable/Entity';

const TOP_ENTITIES_PER_CLUSTER = 6,
    MIN_NUM_ENTITIES_PER_CLUSTER = 5;

const kSteps = range(1, 20).map((value) => {
    return {
        key: value,
        value: value,
        text: value.toString()
    }
});

class AuthorAreas extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authorAreas: []
        }
    }

    componentDidMount = () => {
        const {authorId} = this.props.authorInformation;

        api
            .getAuthorAreas(authorId)
            .then(this.setAuthorAreas)
    }

    setAuthorAreas = (data) => {
        this.setState({
            authorAreas: data
                .clusters
                .filter((area) => area.length >= MIN_NUM_ENTITIES_PER_CLUSTER)
                .map((area) => {
                    var importanceSum = area.reduce((acc, currentEntity) => (acc["importance_score"]
                        ? acc["importance_score"]
                        : acc) + currentEntity["importance_score"]);
                    return {
                        importanceScore: importanceSum / area.length,
                        topics: area.sort((a, b) => b.importance_score - a.importance_score)
                    };
                })
                .sort((a, b) => b.importanceScore - a.importanceScore)
        });
    }

    render = () => {
        const {authorAreas} = this.state,
            normalizedAuthorTopics = authorAreas.map((area, i) => area.topics.slice(0, TOP_ENTITIES_PER_CLUSTER).map((topic, _) => {
                return {
                    id: topic.entity_id,
                    title: normalizeEntityName(topic.entity_name),
                    value: topic.importance_score,
                    group: i,
                    groupImportance: area.importanceScore
                };
            }));

        return (<BubbleChart data={normalizedAuthorTopics} maxRadius={80} group={true}/>)
    }
}

export default AuthorAreas;