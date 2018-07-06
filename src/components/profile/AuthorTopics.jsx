import React, {Component} from 'react';
import {Divider, Header, Icon, Segment} from 'semantic-ui-react';

import ReactTable from "react-table";
import {Range} from 'rc-slider';
import 'rc-slider/assets/index.css';

import "react-table/react-table.css";

import EntityLink from "../reusable/EntityLink"

import {range} from 'lodash';

import StopEntitiesList from "../reusable/StopEntitiesList"

import "./AuthorTopics.css"
import api from '../../api/api'
import {normalizeEntityName} from '../reusable/Entity'
import {inRange} from '../reusable/Util'

class AuthorTopics extends Component {
    constructor(props) {
        super(props);
        const {authorInformation} = this.props;
        let authorYears = Object
            .keys(authorInformation.authorYears)
            .map((val) => parseInt(val, 10))
            .sort();

        let allAuthorYears = range(authorYears[0], authorYears[authorYears.length - 1] + 1);

        this.state = {
            authorTopics: [],
            authorYears: this.generateAuthorYears(allAuthorYears),
            allAuthorYears: allAuthorYears,
            yearsRange: [
                allAuthorYears[0],
                allAuthorYears[allAuthorYears.length - 1]
            ]
        }
    }

    generateAuthorYears = (authorYears) => {
        if (authorYears.length > 12) {
            let oldYearsGranularity = Math.floor((authorYears.length - 6) / 6);
            let recentYears = authorYears
                .slice(-6)
                .map((year, _) => {
                    return {from: year, to: year}
                })

            let oldYears = []

            let currentYear = authorYears[authorYears.length - 7];

            for (var i = 0; i < 5; i++) {
                oldYears.push({
                    from: currentYear - oldYearsGranularity + 1,
                    to: currentYear
                });

                currentYear -= oldYearsGranularity
            }
            oldYears.push({from: authorYears[0], to: currentYear})

            return oldYears
                .reverse()
                .concat(recentYears);

        } else {
            return authorYears.map((year, _) => {
                return {from: year, to: year}
            })
        }
    }

    componentDidMount = () => {
        const {authorId} = this.props.authorInformation;

        api
            .getAuthorTopics(authorId)
            .then(this.setAuthorTopicsImportance);
    }

    filterTopicsByActualYearsRange = (authorTopics, fromYear, toYear) => {
        let filteredAuthorTopics = authorTopics.filter(({years}) => years.some((year) => inRange(year, fromYear, toYear))).map((ent) => {
            const {count, document_count} = Object
                .keys(ent.distribution)
                .reduce((acc, year) => inRange(year, fromYear, toYear)
                    ? ({
                        count: acc.count + ent.distribution[year].count,
                        document_count: acc.document_count + ent.distribution[year].document_count
                    })
                    : acc, {
                    count: 0,
                    document_count: 0
                });

            return {
                entity_name: ent.entity_name,
                entity_id: ent.entity_id,
                years: ent.years,
                count: count,
                document_count: document_count,
                importance_score: ent.importance_score
            }
        });

        return filteredAuthorTopics;
    }

    setAuthorTopicsImportance = (data) => {
        const {yearsRange} = this.state;

        const authorTopics = data
            .topics
            .filter((topic) => !StopEntitiesList.contains(topic.entity_id))
            .map((topic) => Object.defineProperty(topic, "importance_score", {
                // value: Math.log(1 + (topic["document_count"]) * Math.sqrt(topic["pr_score"])
                // * topic["iaf"])
                value: Math.log(1 + (topic["document_count"]) * Math.sqrt(topic["pr_score"]) * topic["iaf"])
            }))
            .sort((topic1, topic2) => topic2["importance_score"] - topic1["importance_score"]);

        this.setState({
            authorTopics: authorTopics,
            filteredAuthorTopics: this.filterTopicsByActualYearsRange(authorTopics, yearsRange[0], yearsRange[1])
        });
    }

    changeYearsRange = (newRange) => {
        const {allAuthorYears, authorTopics} = this.state,
            fromYear = allAuthorYears[newRange[0]],
            toYear = allAuthorYears[newRange[1]];

        this.setState({
            authorYears: this.generateAuthorYears(range(fromYear, toYear + 1)),
            yearsRange: [
                fromYear, toYear
            ],
            filteredAuthorTopics: this.filterTopicsByActualYearsRange(authorTopics, fromYear, toYear)
        });
    }

    renderTopicYears = (topicYears) => {
        const {authorYears} = this.state;
        // const singleYearWidth = 18 * Math.cos(50.0 * (Math.PI / 180)) + 40 * Math.cos(40.0 * (Math.PI / 180));

        return (
            <div
                style={{
                width: 33 * authorYears.length
            }}
                className="years-container">
                {authorYears.map(({
                    from,
                    to
                }, index) => topicYears.some((topicYear, _) => inRange(topicYear, from, to))
                    ? <div key={index} className="single-year-value year-present"/>
                    : <div key={index} className="single-year-value year-absent"/>)}
            </div>
        )
    }

    renderImportanceScoreCell = (prScore, maxPrScore) => {
        const percValue = (prScore / maxPrScore) * 100
        return (
            <div
                style={{
                width: '100%',
                height: '18px',
                backgroundColor: '#dadada',
                borderRadius: '2px'
            }}>
                <div
                    style={{
                    width: `${percValue}%`,
                    height: '100%',
                    backgroundColor: percValue > 66
                        ? '#85cc00'
                        : percValue > 33
                            ? '#ffbf00'
                            : '#ff2e00',
                    borderRadius: '2px',
                    transition: 'all .2s ease-out'
                }}/>
            </div>
        )
    }

    renderTopicYearsHeader = () => {
        const {authorYears} = this.state;

        return (
            <div
                className="years-container"
                style={{
                width: 33 * authorYears.length
            }}>
                {authorYears.map(({
                    from,
                    to
                }, index) => from === to
                    ? <div key={index} className="single-year-header">{from}</div>
                    : <div key={index} className="single-year-header">{from}<br/>{to}</div>)}
            </div>
        )
    }

    renderTopicsTable = () => {
        const {authorTopics, filteredAuthorTopics} = this.state;
        const {authorId} = this.props.authorInformation;
        const maxImportanceScore = authorTopics.length > 0
            ? authorTopics[0].importance_score
            : 1

        return <ReactTable
            data={filteredAuthorTopics}
            columns={[
            {
                Header: "Rank",
                Cell: ({index}) => index + 1,
                width: 40
            }, {
                id: "entity_name",
                Header: "Entity",
                accessor: "entity_name",
                filterable: true,
                filterMethod: (filter, row) => normalizeEntityName(row[filter.id].toLowerCase()).indexOf(filter.value.toLowerCase()) !== -1,
                width: 200,
                Cell: ({original}) => <EntityLink
                        authorId={authorId}
                        entityId={original.entity_id}
                        entityName={original.entity_name}/>
            }, {
                Header: "Count",
                accessor: "count",
                width: 60
            }, {
                Header: "Doc. count",
                accessor: "document_count",
                width: 80
            }, {
                Header: "Years",
                accessor: "years",
                sortable: false,
                filterable: true,
                Filter: () => this.renderTopicYearsHeader(),
                Cell: ({value}) => this.renderTopicYears(value),
                minWidth: 400
            }, {
                Header: "Importance",
                accessor: "importance_score",
                Cell: ({value}) => this.renderImportanceScoreCell(value, maxImportanceScore),
                minWidth: 150,
                maxWidth: 300
            }
        ]}
            defaultSorted={[{
                id: "importance_score",
                desc: true
            }
        ]}
            pageSizeOptions={[10, 15, 20, 30, 50]}
            defaultPageSize={15}
            className="-striped -highlight"/>
    }

    renderRange = () => {
        const {allAuthorYears} = this.state;
        const biggerMarkStyle = {
                'fontSize': '12px'
            },
            standardMarkStyle = {
                'fontSize': '10px'
            };

        const authorYearsMap = allAuthorYears.reduce((acc, val, index) => {
            if (index === 0 || index === allAuthorYears.length - 1) {
                acc[allAuthorYears.indexOf(val)] = {
                    style: biggerMarkStyle,
                    label: val
                };
            } else if (index % 2 === 0) {
                acc[allAuthorYears.indexOf(val)] = {
                    style: standardMarkStyle,
                    label: val
                };
            } else {
                acc[allAuthorYears.indexOf(val)] = {
                    style: standardMarkStyle,
                    label: ""
                };
            }
            return acc;
        }, {});

        return (
            <Segment size="huge" padded={true} color='teal'>
                <Header as='h5'>
                    <Icon name='calendar alternate outline'/>
                    <Header.Content>Select the range of years to analyze.</Header.Content>
                </Header>
                <Divider hidden/>

                <Range
                    activeDotStyle={{
                    borderColor: 'rgb(0, 150, 136)'
                }}
                    handleStyle={[
                    {
                        borderColor: 'rgb(0, 150, 136)'
                    }, {
                        borderColor: 'rgb(0, 150, 136)'
                    }
                ]}
                    trackStyle={[
                    {
                        backgroundColor: 'rgb(0, 150, 136)'
                    }, {
                        backgroundColor: 'rgb(0, 150, 136)'
                    }
                ]}
                    onAfterChange={this.changeYearsRange}
                    step={1}
                    min={0}
                    marks={authorYearsMap}
                    max={allAuthorYears.length - 1}
                    defaultValue={[
                    0, allAuthorYears.length - 1
                ]}/>
                <Divider hidden/>
            </Segment>
        )
    }

    render = () => {
        return <div>
            <div>
                {this.renderRange()}
            </div>
            <Segment padded={true} vertical/>
            <div>
                {this.renderTopicsTable()}
            </div>
        </div>
    }
}

export default AuthorTopics;