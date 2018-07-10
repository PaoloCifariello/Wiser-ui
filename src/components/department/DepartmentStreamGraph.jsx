import React, {PureComponent} from 'react';

import api from '../../api/api'
import {normalizeEntityName} from '../reusable/Entity'
import StreamGraph from '../reusable/StreamGraph'

class DepartmentStreamGraph extends PureComponent {
    constructor(props) {
        super(props);
        const {departmentInformation} = this.props;

        this.state = {
            departmentYears: Object
                .keys(departmentInformation.departmentYears)
                .map((val) => parseInt(val, 10))
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
                .topics
                .map((entity) => ({
                    entity_name: normalizeEntityName(entity.entity_name),
                    entity_id: entity.entity_id,
                    reciaf: entity.reciaf,
                    distribution: entity.distribution,
                    years: entity.years
                }))
        })

    }

    render = () => {
        const {departmentTopics, departmentYears} = this.state;

        return (<StreamGraph topics={departmentTopics} years={departmentYears}/>);
    }
}

export default DepartmentStreamGraph;