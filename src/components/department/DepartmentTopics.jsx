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
            departmentTopics: []
        }
    }

    componentDidMount = () => {
        const {departmentName} = this.props.match.params;

        api
            .getDepartmentTopics(departmentName)
            .then(this.setDepartmentTopics);
    }

    setDepartmentTopics = (data) => {
        const {departmentName, departmentTopics} = data;

        this.setState({
            departmentName: departmentName,
            departmentTopics: departmentTopics
        });
    }

    renderTopicsTable = () => {
        const {departmentTopics} = this.state;

        return <ReactTable
            data={departmentTopics}
            columns={[
            {
                id: "entity_name",
                Header: "Entity",
                accessor: "entity_name",
                filterable: true,
                filterMethod: (filter, row) => normalizeEntityName(row[filter.id].toLowerCase()).indexOf(filter.value.toLowerCase()) !== -1,
                width: 200
            }, {
                Header: "Authors count",
                accessor: "n_authors",
                width: 120
            }, {
                Header: "Document count",
                accessor: "document_count",
                width: 120
            }, {
                Header: "RECIAF",
                accessor: "reciaf",
                width: 150
            }, {
                id: "reciaf2",
                Header: "RECIAF * n_authors",
                accessor: row => row["reciaf"] * row["n_authors"],
                width: 150
            }, {
                id: "reciaf3",
                Header: "RECIAF * n_authors * doc_count",
                accessor: row => row["reciaf"] * row["n_authors"] * row["document_count"],
                width: 180
            }
        ]}
            defaultSorted={[{
                id: "document_count",
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