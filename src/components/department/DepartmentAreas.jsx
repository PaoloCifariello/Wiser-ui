import React, {Component} from 'react';
import {Divider, Header,  Message, Segment} from 'semantic-ui-react';

import api from '../../api/api';
import {BubbleChart} from "../reusable/BubbleChart";
import {normalizeEntityName} from '../reusable/Entity';

import ModalAuthorList from '../reusable/ModalAuthorList';

import Slider from 'rc-slider';

const TOP_ENTITIES_PER_CLUSTER = 6,
    MIN_NUM_ENTITIES_PER_CLUSTER = 3;

const getHelpMessage = (props) => (
    <Message compact {...props}>
        <Message.Content>
            <b>Areas</b> are automatically computed by <span className="wiser-name">Wiser</span> starting from the topics associated to the department. You can interact with the graph by changing the granularity level.
            Lower values are used to include more topics in the computation. Higher values reduce the amount of topics considered by filtering out those that are considered to be less important by <span className="wiser-name">Wiser</span>.
        </Message.Content>
    </Message>
);
    
class DepartmentAreas extends Component {
    constructor(props) {
        super(props);

        this.state = {
            helpMessageVisible: true,
            scoreThreshold: 0.20,
            departmentAreas: [],
            showAuthorAreaList: false
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
                    const importanceSum = area.reduce((acc, currentEntity) => (acc["reciaf"]
                            ? acc["reciaf"]
                            : acc) + currentEntity["reciaf"]),
                        authors = area.reduce((acc, currentEntity) => {
                            // debugger;
                            return acc.concat(currentEntity["authors"])
                        }, []);
                    return {
                        importanceScore: importanceSum / area.length,
                        authors: [...new Set(authors)],
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

    closeAuthorAreaList = () => {
        this.setState({showAuthorAreaList: false, selectedAreaId: -1})
    }

    onGroupClick = ({group}) => {
        this.setState({showAuthorAreaList: true, selectedAreaId: group})
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
        const maxValue = 0.7,
            minValue = 0.05;

        const {departmentAreas, scoreThreshold, showAuthorAreaList, selectedAreaId} = this.state;

        const normalizedDepartmentTopics = departmentAreas.map((area, i) => area.topics.slice(0, TOP_ENTITIES_PER_CLUSTER).map((topic, _) => {
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
                {this.renderHelpMessage()}
                </div>
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
                <BubbleChart
                    data={normalizedDepartmentTopics}
                    maxRadius={80}
                    group={true}
                    onGroupClick={this.onGroupClick}/>
                <div>
                    <ModalAuthorList
                        closeAuthorAreaList={this.closeAuthorAreaList}
                        open={showAuthorAreaList}
                        authors={departmentAreas[selectedAreaId]
                        ? departmentAreas[selectedAreaId].authors
                        : []}/>
                </div>
            </div>
        )
    }
}

export default DepartmentAreas;