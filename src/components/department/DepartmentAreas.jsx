import React, {Component} from 'react';
import {Divider, Header, Segment} from 'semantic-ui-react';
import api from '../../api/api';
import {BubbleChart} from "../reusable/BubbleChart";
import {normalizeEntityName} from '../reusable/Entity';

import Slider from 'rc-slider';

const TOP_ENTITIES_PER_CLUSTER = 6,
    MIN_NUM_ENTITIES_PER_CLUSTER = 3;

class DepartmentAreas extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scoreThreshold: 0.20,
            departmentAreas: []
        }
    }

    componentDidMount = () => {
        const {departmentName} = this.props.departmentInformation;
        const {scoreThreshold} = this.state;

        api
            .getDepartmentAreas(departmentName, scoreThreshold)
            .then(this.setDepartmentAreas)
    }

    setDepartmentAreas = (data) => {
        this.setState({
            departmentAreas: data
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

    changeThreshold = (value) => {
        this.setState({scoreThreshold: parseFloat(value)})
    }

    refreshChart = () => {
        const {scoreThreshold} = this.state;
        const {departmentName} = this.props.departmentInformation;

        this.setState({departmentAreas: []});

        api
            .getDepartmentAreas(departmentName, scoreThreshold)
            .then(this.setDepartmentAreas);
    }

    render = () => {
        const maxValue = 0.7,
            minValue = 0.05;


        const {departmentAreas, scoreThreshold} = this.state,
            normalizedDepartmentTopics = departmentAreas.map((area, i) => area.topics.slice(0, TOP_ENTITIES_PER_CLUSTER).map((topic, _) => {
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
                    <Segment size="huge" padded={true} color='teal'>
                        <Header as='h5'>
                            <Header.Content>Select the granularity.</Header.Content>
                        </Header>
                        <Divider hidden/>

                        <Slider
                            marks={{
                            [minValue.toString()]: "More topics",
                            [maxValue.toString()]: "Less topics"
                        }}
                            min={minValue}
                            max={maxValue}
                            step={0.01}
                            onChange={this.changeThreshold}
                            onAfterChange={this.refreshChart}
                            value={scoreThreshold}/>
                    </Segment>
                </div>
                <BubbleChart data={normalizedDepartmentTopics} maxRadius={80} group={true}/>
            </div>
        )
    }
}

export default DepartmentAreas;