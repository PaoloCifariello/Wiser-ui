import React, {PureComponent} from 'react';

import {Form, Select, List} from 'semantic-ui-react'

import {
    AreaChart,
    ResponsiveContainer,
    Area,
    XAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';
import {scale, brewer} from 'chroma-js';
import {range, inRange} from 'lodash';

import './StreamGraph.css';

const getOptions = (options) => options.map((option, _) => {
    return {
        key: option,
        value: option,
        text: option.toString()
    }
});

const STREAMGRAPH_HEIGHT = 350;

const YEARS_OPTIONS = getOptions(range(2, 11, 2));
const TOP_ENTITIES_OPTIONS = getOptions([1, 2, 3, 4, 5]);

const getPercent = (value, total) => {
    const ratio = total > 0
        ? value / total
        : 0;

    return toPercent(ratio, 2);
};

const toPercent = (decimal, fixed = 0) => {
    return `${ (decimal * 100).toFixed(fixed)}%`;
};
const renderTooltipContent = (o) => {
    const {payload, label} = o;
    if (payload === null) 
        return null;
    
    const total = payload.reduce((result, entry) => (result + entry.value), 0);

    return (
        <div className="customized-tooltip-content">
            <h4>{label}</h4>
            <List>
                {payload.map((entry, index) => (
                    <List.Item key={`item-${index}`}>
                        <List.Icon
                            name='circle'
                            style={{
                            color: entry.color
                        }}/>
                        <List.Content>{`${entry.name}: ${getPercent(entry.value, total)}`}</List.Content>
                    </List.Item>
                ))
}
            </List>
        </div>
    );
};

class StreamGraph extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            yearsStep: 6,
            topEntitiesForRange: 2
        }
    }

    handleChangeYearsRange = (e, {value}) => {
        this.setState({yearsStep: value});
    }

    handleChangeTopEntitiesForRange = (e, {value}) => {
        this.setState({topEntitiesForRange: value});
    }

    _generateRangeEntities = (entityNames, minYear, maxYear) => {
        const {topics} = this.props,
            time = minYear - maxYear === 0
                ? `${minYear}`
                : `${minYear} - ${maxYear}`;

        var rangeYearObject = {
            "time": time
        };

        topics.forEach((topic) => {
            if (entityNames.indexOf(topic.entity_name) === -1) {
                return;
            }

            let topicImportance = range(minYear, maxYear + 1).map((year) => topic.distribution[year]).filter((el) => el !== undefined).reduce((acc, val) => acc + val.document_count, 0);
            if (topicImportance > 0) {
                rangeYearObject[topic.entity_name] = topicImportance
                // topEntities.push({topicName: topic.entity_name, topicImportance:
                // topicImportance});
            }
        });
        return rangeYearObject
    }

    getTopicImportanceInRange = (minYear, maxYear, topic) => {
        return topic.reciaf * range(minYear, maxYear + 1).map((year) => topic.distribution[year]).filter((el) => el !== undefined).reduce((acc, val) => acc + val.document_count, 0);
    }

    getEntitiesInRange = (minYear, maxYear) => {
        const {topics} = this.props, {topEntitiesForRange} = this.state;

        return topics.filter((topic) => topic.years.filter((topicYear) => inRange(topicYear, minYear, maxYear)).length > 0).map((topic) => {
            let topicImportance = this.getTopicImportanceInRange(minYear, maxYear, topic);
            return {entityName: topic.entity_name, documentCount: topicImportance}
        }).sort((t1, t2) => t2.documentCount - t1.documentCount)
            .slice(0, topEntitiesForRange)
            .map((t) => t.entityName);
    }

    getEntityYearsMap = () => {
        const {yearsStep} = this.state, {years} = this.props,
            firstYear = years[0],
            lastYear = years[years.length - 1],
            graphDrawingYearsStep = 2;

        var tagdata = [],
            entityNames = [];

        if (years.length > 0) {
            let i;
            // first cycle is only used to determine top entities for each range of study
            for (i = lastYear; i >= firstYear; i -= yearsStep) {
                entityNames = entityNames.concat(this.getEntitiesInRange(Math.max(i - yearsStep + 1, firstYear), i));
            }

            entityNames = Array.from(new Set(entityNames));

            // second cycle is to compute importances used to draw the graph, here we use a
            // fixed step = 2
            for (i = lastYear; i >= firstYear; i -= graphDrawingYearsStep) {
                const rangeEntities = this._generateRangeEntities(entityNames, Math.max(i - graphDrawingYearsStep + 1, firstYear), i);
                tagdata.push(rangeEntities);
                // entityNames = entityNames.concat(rangeEntityNames);
            }
        }

        return {
            entityYearsMap: tagdata.reverse(),
            entityNames: Array.from(new Set(entityNames))
        };
    }

    renderStreamCloud = () => {
        const {entityYearsMap, entityNames} = this.getEntityYearsMap();
        const colorScale = scale(brewer.set1).colors(entityNames.length);

        return (
            <AreaChart
                data={entityYearsMap}
                stackOffset="wiggle"
                margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
            }}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="time"/>
                <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={15}
                    height={50}/>
                <Tooltip content={renderTooltipContent}/> {entityNames.map((entityName, i) => <Area
                    activeDot={false}
                    type="monotone"
                    key={i}
                    dataKey={entityName}
                    stackId={1}
                    stroke={colorScale[i]}
                    fill={colorScale[i]}/>)}
            </AreaChart>
        );
    }

    render = () => {
        const {yearsStep, topEntitiesForRange} = this.state;

        return (
            <div>
                <Form>

                    <Form.Group>
                        <Form.Field
                            control={Select}
                            label='Select range of years to examine.'
                            options={YEARS_OPTIONS}
                            value={yearsStep}
                            onChange={this.handleChangeYearsRange}
                            placeholder='Select how many years...'/>
                        <Form.Field
                            control={Select}
                            label='Select how many topics for each range'
                            options={TOP_ENTITIES_OPTIONS}
                            value={topEntitiesForRange}
                            onChange={this.handleChangeTopEntitiesForRange}
                            placeholder='Select how many topics...'/>
                    </Form.Group>
                </Form>
                <ResponsiveContainer height={STREAMGRAPH_HEIGHT}>
                    {this.renderStreamCloud()}
                </ResponsiveContainer>
            </div>
        );
    }
}

export default StreamGraph;