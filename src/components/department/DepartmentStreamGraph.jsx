import React, {PureComponent} from 'react';

import {Form, Select, List} from 'semantic-ui-react'
import api from '../../api/api'
// import {inRange} from '../reusable/Util'
import {normalizeEntityName} from '../reusable/Entity'

import {
    AreaChart,
    ResponsiveContainer,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';

import {scale, brewer} from 'chroma-js';

import {range, inRange} from 'lodash';

// import "./AuthorTagStreamGraph.css" n. of top entities (wrt RECIAF) to
// consider when making the Stream graph
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

class DepartmentStreamGraph extends PureComponent {
    constructor(props) {
        super(props);
        const {departmentInformation} = this.props;

        this.state = {
            yearsStep: 6,
            topEntitiesForRange: 2,
            departmentYears: departmentInformation
                .departmentYears
                .sort(),
            departmentTopics: []
        }
    }

    componentDidMount = () => {
        const {departmentName} = this.props.match.params;

        api
            .getDepartmentTopics(departmentName)
            .then(this.setDepartmentTopicsState)
    }

    setDepartmentTopicsState = (data) => {
        this.setState({
            departmentTopics: data
                .department_topics
                .map((entity) => ({
                    entity_name: normalizeEntityName(entity.entity_name),
                    entity_id: entity.entity_id,
                    reciaf: entity.reciaf,
                    distribution: entity.distribution,
                    years: entity.years
                }))
                // .sort((a, b) => b.reciaf - a.reciaf) .slice(0, TOP_NUM_ENTITIES)
        })

    }

    handleChangeYearsRange = (e, {value}) => {
        this.setState({yearsStep: value});
    }

    handleChangeTopEntitiesForRange = (e, {value}) => {
        this.setState({topEntitiesForRange: value});
    }

    _generateRangeEntities = (entityNames, minYear, maxYear) => {
        const {departmentTopics, topEntitiesForRange} = this.state,
            time = minYear - maxYear === 0
                ? `${minYear}`
                : `${minYear} - ${maxYear}`;

        var rangeYearObject = {
            "time": time
        };
        let totalSum = 0;

        let topEntities = [];

        departmentTopics.forEach((topic) => {
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
        // for (var j = 0; j < departmentTopics.length; j++) {     let entity =
        // departmentTopics[j];     // inRangeYears = entity     .years .filter((year)
        // => inRange(year, minYear,     // maxYear + 1));     let entityImportance =
        // range(minYear, maxYear + 1).map((year) =>
        // entity.distribution[year]).filter((el) => el !== undefined).reduce((acc, val)
        // => acc + val.document_count, 0);     if (entityImportance > 0) {
        // topEntities.push({entityName: entity.entity_name, entityImportance:
        // entityImportance});     }     // if (inRangeYears.length > 0) {     let
        // entityImportance = entity.reciaf *     // entity.inRangeYears.length;
        // rangeYearObject[entity.entity_name] =     // entityImportance     totalSum +=
        // entityImportance; } } var entityNames = []; topEntities.sort((e1, e2) =>
        // e2.entityImportance - e1.entityImportance)     .slice(0, topEntitiesForRange)
        //     .forEach((entity) => {         rangeYearObject[entity.entityName] =
        // entity.entityImportance         entityNames.push(entity.entityName);     })

        return rangeYearObject
    }

    getEntitiesInRange = (minYear, maxYear) => {
        const {departmentTopics, topEntitiesForRange} = this.state;

        return departmentTopics.filter((topic) => topic.years.filter((topicYear) => inRange(topicYear, minYear, maxYear)).length > 0).map((topic) => {
            let topicImportance = range(minYear, maxYear + 1).map((year) => topic.distribution[year]).filter((el) => el !== undefined).reduce((acc, val) => acc + val.document_count, 0);
            return {entityName: topic.entity_name, documentCount: topicImportance}
        }).sort((t1, t2) => t2.documentCount - t1.documentCount)
            .slice(0, topEntitiesForRange)
            .map((t) => t.entityName);
    }

    getEntityYearsMap = () => {
        const {departmentYears, yearsStep} = this.state,
            firstYear = departmentYears[0],
            lastYear = departmentYears[departmentYears.length - 1],
            graphDrawingYearsStep = 2;

        var tagdata = [],
            entityNames = [];

        if (departmentYears.length > 0) {
            // first cycle is only used to determine top entities for each range of study
            for (var i = lastYear; i >= firstYear; i -= yearsStep) {
                entityNames = entityNames.concat(this.getEntitiesInRange(Math.max(i - yearsStep + 1, firstYear), i));
            }

            entityNames = Array.from(new Set(entityNames));

            // second cycle is to compute importances used to draw the graph, here we use a
            // fixed step = 2
            for (var i = lastYear; i >= firstYear; i -= graphDrawingYearsStep) {
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
        // const {departmentTopics} = this.state;
        const {entityYearsMap, entityNames} = this.getEntityYearsMap();
        const colorScale = scale(brewer.set1).colors(entityNames.length);
        console.log(entityYearsMap);
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

export default DepartmentStreamGraph;