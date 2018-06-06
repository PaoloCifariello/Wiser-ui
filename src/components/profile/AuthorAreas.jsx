import React, {Component} from 'react';
import {Button, Input} from 'semantic-ui-react';
import api from '../../api/api';
import {BubbleChart} from "../reusable/BubbleChart";
import {normalizeEntityName} from '../reusable/Entity';

const TOP_ENTITIES_PER_CLUSTER = 6,
    MIN_NUM_ENTITIES_PER_CLUSTER = 1;

class AuthorAreas extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scoreThreshold: 0.20,
            authorAreas: []
        }
    }

    componentDidMount = () => {
        const {authorId} = this.props.authorInformation;
        const {scoreThreshold} = this.state;

        api
            .getAuthorAreas(authorId, scoreThreshold)
            .then(this.setAuthorAreas)
    }

    setAuthorAreas = (data) => {
        this.setState({
            authorAreas: data
                .clusters
                .filter((area) => area.length >= MIN_NUM_ENTITIES_PER_CLUSTER)
                .map((area) => {
                    var importanceSum = area.reduce((acc, currentEntity) => (acc["reciaf"]
                        ? acc["reciaf"]
                        : acc) + currentEntity["reciaf"]);
                    return {
                        importanceScore: importanceSum / area.length,
                        topics: area.sort((a, b) => b.reciaf - a.reciaf)
                    };
                })
                .sort((a, b) => b.importanceScore - a.importanceScore)
        });
    }

    changeThreshold = (_, {value}) => {
        this.setState({scoreThreshold: parseFloat(value)})
    }

    refreshChart = () => {
        const {scoreThreshold} = this.state;
        const {authorId} = this.props.authorInformation;

        this.setState({authorAreas: []});

        api
            .getAuthorAreas(authorId, scoreThreshold)
            .then(this.setAuthorAreas);
    }

    render = () => {
        const {authorAreas, scoreThreshold} = this.state,
            normalizedAuthorTopics = authorAreas.map((area, i) => area.topics.slice(0, TOP_ENTITIES_PER_CLUSTER).map((topic, _) => {
                return {
                    id: topic.entity_id,
                    title: normalizeEntityName(topic.entity_name),
                    value: topic.reciaf,
                    group: i,
                    groupImportance: area.importanceScore
                };
            }));

        return (
            <div>
                <div>
                    <Input
                        onChange={this.changeThreshold}
                        value={scoreThreshold}
                        min="0.01"
                        step="0.01"
                        max="0.99"
                        type="number"/>
                    <Button onClick={this.refreshChart}>Refresh</Button>
                </div>
                <BubbleChart data={normalizedAuthorTopics} maxRadius={80} group={true}/>
            </div>
        )
    }
}

export default AuthorAreas;