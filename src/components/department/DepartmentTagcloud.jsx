import React, {PureComponent} from 'react';
import {Card, Form, Select} from 'semantic-ui-react'
import {TagCloud} from 'react-tagcloud'

// import Slider from 'rc-slider';
import WiserTagCloud from '../reusable/WiserTagClouds';
import api from '../../api/api'

class DepartmentTagcloud extends PureComponent {
    constructor(props) {
        super(props);
        const {departmentYears} = this.props.departmentInformation;

        this.state = {
            departmentYears: Object
                .keys(departmentYears)
                .map((y) => parseInt(y, 10))
                .sort(),
            departmentTopics: []
        }
    }

    componentDidMount = () => {
        const {departmentName} = this.props.departmentInformation;

        api
            .getDepartmentTopics(departmentName)
            .then(this.setDepartmentTopicsState)
    }

    setDepartmentTopicsState = (data) => {
        this.setState({departmentTopics: data.topics})
    }

    render = () => {
        const {departmentYears, departmentTopics} = this.state;
        return <WiserTagCloud topics={departmentTopics} years={departmentYears}/>
    }
}

export default DepartmentTagcloud;