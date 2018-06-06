import React, {PureComponent} from 'react';

import {Form, Select, List} from 'semantic-ui-react'
import api from '../../api/api'
import {inRange} from '../reusable/Util'
import {normalizeEntityName, computeEntityReciaf} from '../reusable/Entity'

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

import {schemeCategory10} from 'd3-scale-chromatic'
import "./AuthorTagStreamGraph.css"

// n. of top entities (wrt RECIAF) to consider when making the Stream graph
const TOP_NUM_ENTITIES = 7
const STREAMGRAPH_HEIGHT = 350;

const YEARS_OPTIONS_UP_TO = 5;
const YEARS_OPTIONS = [...Array(YEARS_OPTIONS_UP_TO)].map((_, index) => {
    index += 1
    return {
        key: index,
        value: index,
        text: index.toString()
    }
});

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

class AuthorTagStreamGraph extends PureComponent {
    constructor(props) {
        super(props);
        const {authorInformation} = this.props;

        this.state = {
            yearsStep: 5,
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
                .map((entity) => {
                    return {
                        entity_name: normalizeEntityName(entity.entity_name),
                        entity_id: entity.entity_id,
                        reciaf: entity.reciaf,
                        years: entity.years

                    }
                })
                .sort((a, b) => b.reciaf - a.reciaf)
                .slice(0, TOP_NUM_ENTITIES)
        })
    }

    handleChange = (e, {value}) => {
        this.setState({yearsStep: value});
    }

    _generateRangeEntities = (minYear, maxYear) => {
        const {authorTopics} = this.state,
            time = minYear - maxYear === 0
                ? `${minYear}`
                : `${minYear} - ${maxYear}`;

        var rangeYearObject = {
            "time": time
        };
        let totalSum = 0;

        for (var j = 0; j < authorTopics.length; j++) {
            let entity = authorTopics[j],
                inRangeYears = entity
                    .years
                    .filter((year) => inRange(year, minYear, maxYear));

            if (inRangeYears.length > 0) {
                let entityImportance = entity.reciaf * inRangeYears.length;
                rangeYearObject[entity.entity_name] = entityImportance
                totalSum += entityImportance;
            }
        }

        for (var e in rangeYearObject) {
            if (e !== "time") {
                rangeYearObject[e] /= totalSum;
            }
        }

        return rangeYearObject;
    }

    getEntityYearsMap = () => {
        const {authorYears, yearsStep, authorTopics} = this.state,
            firstYear = authorYears[0],
            lastYear = authorYears[authorYears.length - 1];

        var tagdata = []
        if (authorTopics.length > 0) {
            for (var i = lastYear; i >= firstYear; i -= yearsStep) {
                tagdata.push(this._generateRangeEntities(Math.max(i - yearsStep + 1, firstYear), i))

            }
        }

        return tagdata.reverse();
    }

    renderStreamCloud = () => {
        const {authorTopics} = this.state;

        const entityYearsMap = this.getEntityYearsMap();
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
                <Tooltip content={renderTooltipContent}/> {authorTopics.map((authorTopic, i) => <Area
                    activeDot={false}
                    type="monotone"
                    key={i}
                    dataKey={authorTopic.entity_name}
                    stackId={1}
                    stroke={schemeCategory10[i]}
                    fill={schemeCategory10[i]}/>)}
            </AreaChart>
        );
    }

    render = () => {
        const {yearsStep} = this.state;

        return (
            <div>
                <Form>
                    <Form.Group>
                        <Form.Field
                            control={Select}
                            label='Select how many years to consider for each step'
                            options={YEARS_OPTIONS}
                            value={yearsStep}
                            onChange={this.handleChange}
                            placeholder='Select how many years...'/>
                    </Form.Group>
                </Form>
                <ResponsiveContainer height={STREAMGRAPH_HEIGHT}>
                    {this.renderStreamCloud()}
                </ResponsiveContainer>
            </div>
        );
    }
}

export default AuthorTagStreamGraph;