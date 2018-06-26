import React, {Component} from 'react';

import {Divider, Header, Icon, Segment} from 'semantic-ui-react';

import ReactTable from "react-table";
import {Range} from 'rc-slider';
import "react-table/react-table.css";

import StopEntitiesList from "../reusable/StopEntitiesList"

import EntityLink from "../reusable/EntityLink"

import {range} from 'lodash';

import "./DepartmentTopics.css"
import api from '../../api/api'
import {normalizeEntityName} from '../reusable/Entity'
import {inRange} from '../reusable/Util'

class DepartmentTopics extends Component {
    constructor(props) {
        super(props);
        const {departmentInformation} = this.props;
        const allDepartmentYears = departmentInformation.departmentYears;

        this.state = {
            departmentTopics: [],
            filteredDepartmentTopics: [],
            departmentYears: this.generateDepartmentYears(departmentInformation.departmentYears),
            allDepartmentYears: allDepartmentYears,
            yearsRange: [
                allDepartmentYears[0],
                allDepartmentYears[allDepartmentYears.length - 1]
            ]
        }
    }

    componentDidMount = () => {
        const {departmentName} = this.props.match.params;

        api
            .getDepartmentTopics(departmentName)
            .then(this.setDepartmentTopics);
    }

    filterTopicsByActualYearsRange = (departmentTopics, fromYear, toYear) => {
        let filteredDepartmentTopics = departmentTopics.filter(({years}) => years.some((year) => inRange(year, fromYear, toYear))).map((ent) => {
            const {count, document_count, authors} = Object
                .keys(ent.distribution)
                .reduce((acc, year) => inRange(year, fromYear, toYear)
                    ? ({
                        count: acc.count + ent.distribution[year].count,
                        document_count: acc.document_count + ent.distribution[year].count,
                        // num. of authors in a specific years range is the max between the num. of
                        // authors in each single year in that range
                        authors: acc
                            .authors
                            .concat(ent.distribution[year].authors)
                    })
                    : acc, {
                    count: 0,
                    document_count: 0,
                    authors: []
                });

            return {
                entity_name: ent.entity_name,
                entity_id: ent.entity_id,
                n_authors: ent.n_authors,
                years: ent.years,
                count: count,
                document_count: document_count,
                author_count: Array
                    .from(new Set(authors))
                    .length,
                reciaf: ent.reciaf,
                importance_score: ent.importance_score
            }
        });

        return filteredDepartmentTopics;
    }

    setDepartmentTopics = (data) => {
        const {yearsRange} = this.state;

        // importance_score computed starting from REC-IAF to reduce differences
        const departmentName = data.department_name,
            departmentTopics = data
                .department_topics
                .filter((topic) => !StopEntitiesList.contains(topic.entity_id))
                .map((topic) => ({
                    importance_score: Math.log(1.0 + topic.reciaf),
                    ...topic
                }))
                .sort((topic1, topic2) => topic2["importance_score"] - topic1["importance_score"]);

        this.setState({
            departmentName: departmentName,
            departmentTopics: departmentTopics,
            filteredDepartmentTopics: this.filterTopicsByActualYearsRange(departmentTopics, yearsRange[0], yearsRange[1])
        });
    }

    generateDepartmentYears = (departmentYears) => {
        departmentYears = range(departmentYears[0], departmentYears[departmentYears.length - 1] + 1);
        if (departmentYears.length > 12) {
            let oldYearsGranularity = Math.floor((departmentYears.length - 6) / 6);
            let recentYears = departmentYears
                .slice(-6)
                .map((year, _) => {
                    return {from: year, to: year}
                })

            let oldYears = []

            let currentYear = departmentYears[departmentYears.length - 7];

            for (var i = 0; i < 5; i++) {
                oldYears.push({
                    from: currentYear - oldYearsGranularity + 1,
                    to: currentYear
                });

                currentYear -= oldYearsGranularity
            }
            oldYears.push({from: departmentYears[0], to: currentYear})

            return oldYears
                .reverse()
                .concat(recentYears);

        } else {
            return departmentYears.map((year, _) => {
                return {from: year, to: year}
            })
        }
    }

    changeYearsRange = (newRange) => {
        const {allDepartmentYears, departmentTopics} = this.state,
            fromYear = allDepartmentYears[newRange[0]],
            toYear = allDepartmentYears[newRange[1]];

        this.setState({
            departmentYears: this.generateDepartmentYears(range(fromYear, toYear + 1)),
            yearsRange: [
                fromYear, toYear
            ],
            filteredDepartmentTopics: this.filterTopicsByActualYearsRange(departmentTopics, fromYear, toYear)
        });
    }

    renderTopicYearsHeader = () => {
        const {departmentYears} = this.state;

        return (
            <div
                className="years-container"
                style={{
                width: 33 * departmentYears.length
            }}>
                {departmentYears.map(({
                    from,
                    to
                }, index) => from === to
                    ? <div key={index} className="single-year-header">{from}</div>
                    : <div key={index} className="single-year-header">{from}<br/>{to}</div>)}
            </div>
        )
    }

    renderTopicYears = (topicYears) => {
        const {departmentYears} = this.state;

        // const singleYearWidth = 18 * Math.cos(50.0 * (Math.PI / 180)) + 40 *
        // Math.cos(40.0 * (Math.PI / 180));

        return (
            <div
                style={{
                width: 33 * departmentYears.length
            }}
                className="years-container">
                {departmentYears.map(({
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

    renderTopicsTable = () => {
        const {departmentTopics, filteredDepartmentTopics} = this.state;
        const maxImportanceScore = departmentTopics.length > 0
            ? departmentTopics[0].importance_score
            : 1.0;

        return <ReactTable
            data={filteredDepartmentTopics}
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
                Cell: ({original}) => <EntityLink entityId={original.entity_id} entityName={original.entity_name}/>
            }, {
                Header: "Authors",
                accessor: "author_count",
                width: 65
            }, {
                Header: "Doc. count",
                accessor: "document_count",
                width: 80
            }, {
                Header: "Count",
                accessor: "count",
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
        const {allDepartmentYears} = this.state;
        const biggerMarkStyle = {
                'fontSize': '12px'
            },
            standardMarkStyle = {
                'fontSize': '10px'
            };

        const departmentYearsMap = allDepartmentYears.reduce((acc, val, index) => {
            if (index === 0 || index === allDepartmentYears.length - 1) {
                acc[allDepartmentYears.indexOf(val)] = {
                    style: biggerMarkStyle,
                    label: val
                };
            } else if (index % 2 === 0) {
                acc[allDepartmentYears.indexOf(val)] = {
                    style: standardMarkStyle,
                    label: val
                };
            } else {
                acc[allDepartmentYears.indexOf(val)] = {
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
                    marks={departmentYearsMap}
                    max={allDepartmentYears.length - 1}
                    defaultValue={[
                    0, allDepartmentYears.length - 1
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

export default DepartmentTopics;