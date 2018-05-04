import React, {PureComponent} from 'react';
import {Card, Form, Select} from 'semantic-ui-react'
import {TagCloud} from 'react-tagcloud'

// import Slider from 'rc-slider';

import api from '../../api/api'

import {normalizeEntityName, computeEntityReciaf} from '../reusable/Entity'

const yearOptionsUpTo = 5;
const yearOptions = [...Array(yearOptionsUpTo)].map((_, index) => {
    index += 1
    return {
        key: index,
        value: index,
        text: index.toString()
    }
});

class AuthorTagcloud extends PureComponent {
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

    setAuthorTopicsState = (data) => this.setState({
        authorTopics: data
            .topics
            .map((entity) => {
                return {
                    value: normalizeEntityName(entity.entity_name),
                    count: computeEntityReciaf(entity),
                    years: entity.years
                }
            })
    })

    handleChange = (e, {value}) => {
        this.setState({yearsStep: value});
    }

    renderWordCloud = (firstYear, lastYear) => {
        const {authorTopics} = this.state;

        const topics = authorTopics.filter(({years}) => years.some((year) => year <= lastYear && year >= firstYear)).slice(0, 30)

        if (topics.length) 
            return (
                <Card key={`${firstYear}-${lastYear}`} fluid>
                    <Card.Content
                        header={firstYear === lastYear
                        ? firstYear
                        : `${firstYear} - ${lastYear}`}/>
                    <Card.Content >
                        <TagCloud minSize={15} maxSize={30} tags={topics}/>
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
            // if firstYear is before first author publication, we move it to first author
            // pub. year. We add only non empty clouds.

            let wordCloud = this.renderWordCloud(i - yearsStep + 1 < firstYear
                ? firstYear
                : i - yearsStep + 1, i)
            if (wordCloud) 
                tags.push(wordCloud)
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

export default AuthorTagcloud;