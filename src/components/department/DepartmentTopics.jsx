import React, {Component} from 'react';
import {List} from 'semantic-ui-react'

import ReactTable from "react-table";
import "react-table/react-table.css";

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

        this.state = {
            departmentTopics: [],
            departmentYears: this.generateDepartmentYears(departmentInformation.departmentYears)
        }
    }

    componentDidMount = () => {
        const {departmentName} = this.props.match.params;

        api
            .getDepartmentTopics(departmentName)
            .then(this.setDepartmentTopics);
    }

    setDepartmentTopics = (data) => {
        const departmentName = data.department_name,
            departmentTopics = data
                .department_topics
                .sort((topic1, topic2) => topic2["reciaf"] - topic1["reciaf"])
                .map((topic, index) => Object.defineProperty(topic, 'importance_rank', {
                    value: index + 1
                }));

        this.setState({departmentName: departmentName, departmentTopics: departmentTopics});
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

        const singleYearWidth = 18 * Math.cos(50.0 * (Math.PI / 180)) + 40 * Math.cos(40.0 * (Math.PI / 180));

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
        const {departmentTopics} = this.state;
        const maxImportanceScore = departmentTopics.length > 0
            ? departmentTopics[0].reciaf
            : 1.0;

        return <ReactTable
            data={departmentTopics}
            columns={[
            {
                Header: "Rank",
                accessor: "importance_rank",
                width: 40
            }, {
                id: "entity_name",
                Header: "Entity",
                accessor: "entity_name",
                filterable: true,
                filterMethod: (filter, row) => normalizeEntityName(row[filter.id].toLowerCase()).indexOf(filter.value.toLowerCase()) !== -1,
                width: 200
            }, {
                Header: "Authors",
                accessor: "n_authors",
                width: 65
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
                accessor: "reciaf",
                Cell: ({value}) => this.renderImportanceScoreCell(value, maxImportanceScore),
                minWidth: 150,
                maxWidth: 300
            }
        ]}
            defaultSorted={[{
                id: "reciaf",
                desc: true
            }
        ]}
            pageSizeOptions={[10, 15, 20, 30, 50]}
            defaultPageSize={15}
            className="-striped -highlight"/>
    }

    render = () => {
        return <div>
            {this.renderTopicsTable()}
        </div>
    }
}

export default DepartmentTopics;