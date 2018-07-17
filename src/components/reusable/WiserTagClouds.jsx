import React, {PureComponent} from 'react';
import {Card, Form, Select} from 'semantic-ui-react'
import {TagCloud} from 'react-tagcloud'

import {withRouter} from 'react-router-dom'

import PropTypes from 'prop-types';
import {range, inRange} from 'lodash';
import {normalizeEntityName} from './Entity';

const yearOptionsUpTo = 5;
const yearOptions = [...Array(yearOptionsUpTo)].map((_, index) => {
    index += 1
    return {
        key: index,
        value: index,
        text: index.toString()
    }
});

const TOP_ENTITIES_FOR_CLOUD = 25;

class WiserTagCloud extends PureComponent {
    static defaultProps = {
        yearsStep: 5
    }

    constructor(props) {
        super(props);

        const {yearsStep} = this.props
        this.state = {
            yearsStep: yearsStep
        }
    }

    handleChange = (e, {value}) => {
        this.setState({yearsStep: value});
    }

    getTopicImportanceInRange = (minYear, maxYear, topic) => {
        return topic.reciaf * range(minYear, maxYear + 1).map((year) => topic.distribution[year]).filter((el) => el !== undefined).reduce((acc, val) => acc + val.document_count, 0);
    }

    getTopicsInRange = (minYear, maxYear) => {
        const {topics} = this.props;

        return topics.filter((topic) => topic.years.filter((topicYear) => inRange(topicYear, minYear, maxYear + 1)).length > 0).map((topic) => {
            let topicImportance = this.getTopicImportanceInRange(minYear, maxYear, topic);
            return {entityId: topic.entity_id, entityName: topic.entity_name, documentCount: topicImportance}
        }).sort((t1, t2) => t2.documentCount - t1.documentCount)
            .slice(0, TOP_ENTITIES_FOR_CLOUD)
            .map((t) => ({
                entityId: t.entityId,
                value: normalizeEntityName(t.entityName),
                count: t.documentCount
            }));
    }

    onTagClick = ({entityId}) => {
        const {authorId} = this.props;

        this
            .props
            .history
            .push(`/profile/${authorId}/publications/${entityId}`)
    }

    renderCloud = (topics) => {
        const {authorId} = this.props;

        return (authorId)
            ? <TagCloud
                    className="author-tag-cloud"
                    minSize={15}
                    maxSize={30}
                    tags={topics}
                    onClick={(tag) => this.onTagClick(tag)}/>
            : <TagCloud minSize={15} maxSize={30} tags={topics}/>
    }

    renderWordCloud = (firstYear, lastYear) => {
        const topics = this.getTopicsInRange(firstYear, lastYear);
        
        if (topics.length) 
            return (
                <Card key={`${firstYear}-${lastYear}`} fluid>
                    <Card.Content
                        header={firstYear === lastYear
                        ? firstYear
                        : `${firstYear} - ${lastYear}`}/>
                    <Card.Content >
                        {this.renderCloud(topics)}
                    </Card.Content >
                </Card>
            );
        }
    renderWordClouds = () => {
        const {yearsStep} = this.state, {years} = this.props,
            firstYear = years[0],
            lastYear = years[years.length - 1];

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

WiserTagCloud.propTypes = {
    yearsStep: PropTypes.number
}

export default withRouter(WiserTagCloud);