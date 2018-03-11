import React, {Component} from 'react';
import {Card, Form, Select} from 'semantic-ui-react'
import {TagCloud} from 'react-tagcloud'

import api from '../../api/api'

const yearOptionsUpTo = 5;
const yearOptions = [...Array(yearOptionsUpTo)].map((_, index) => {
    index += 1
    return {
        key: index,
        value: index,
        text: index.toString()
    }
});

class AuthorWordcloud extends Component {
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
            .then((res) => this.setState({
                authorTopics: res
                    .data
                    .topics
                    .map(({entity_name, pr_score, years}) => {
                        return {value: entity_name, count: pr_score, years: years}
                    })
            }))
    }

    handleChange = (e, {name, value}) => {
        this.setState({yearsStep: value});
    }

    renderWordCloud = (firstYear, lastYear) => {
        const {authorTopics} = this.state;

        return (
            <Card key={`${firstYear}-${lastYear}`} fluid>
                <Card.Content header={`${firstYear} - ${lastYear}`}/>
                <Card.Content >
                    <TagCloud
                        minSize={15}
                        maxSize={30}
                        tags={authorTopics.filter(({years}) => years.some((year) => year <= lastYear && year > firstYear)).slice(0, 30)}/>
                </Card.Content >
            </Card>
        );
    }
    renderWordClouds = () => {
        const {authorYears, yearsStep} = this.state,
            firstYear = authorYears[0],
            lastYear = authorYears[authorYears.length - 1]

        let tags = [];
        for (var i = lastYear; i >= firstYear; i -= yearsStep) {
            tags.push(this.renderWordCloud(i - yearsStep, i))
        }

        return tags;
    }

    render = () => {
        const {yearsStep} = this.state;

        return (
            <div>
                <Form>
                    <Form.Group>
                        <Form.Field
                            control={Select}
                            label='Select how many years to consider for each cloud'
                            options={yearOptions}
                            value={yearsStep}
                            onChange={this.handleChange}
                            placeholder='Select how many years...'/>
                    </Form.Group>
                </Form>
                <div>
                    {this.renderWordClouds()}
                </div>
            </div>
        );
    }
}

export default AuthorWordcloud;