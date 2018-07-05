import React, {Component} from 'react'

import {Divider, Grid, Icon, Loader, Statistic} from 'semantic-ui-react'
import WiserLogo from '../reusable/WiserLogo';

import api from '../../api/api'
import {normalizeEntityName} from '../reusable/Entity'

class WiserStatistics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        }
    }

    componentDidMount = () => {
        api
            .getStatistics()
            .then(this.setStatisticInformation)
    }

    setStatisticInformation = (data) => {
        this.setState({
            documentCount: data.document_count,
            authorCount: data.author_count,
            topicCount: data.topic_count,
            queryCount: data.query_count,
            avgAuthorPerDocument: data.avg_author_per_document,
            profileViewCount: data.profile_view_count,
            mostFrequentQueries: data.most_frequent_queries,
            mostFrequentTopics: data.most_frequent_topics,
            mostFrequentProfiles: data.most_frequent_profiles,
            loading: false
        });
    }

    renderLoader = () => {
        return <Loader active inline='centered'/>
    }

    renderStats = () => {
        const {
            documentCount,
            authorCount,
            topicCount,
            queryCount,
            avgAuthorPerDocument,
            profileViewCount,
            mostFrequentQueries,
            mostFrequentTopics,
            mostFrequentProfiles
        } = this.state;

        return (
            <Grid centered stackable className="margin-top15" textAlign='center'>
                <Grid.Row >
                    <WiserLogo/>
                </Grid.Row>
                <Divider/>
                <Grid.Row>
                    <Statistic.Group size="small">
                        <Statistic>
                            <Statistic.Value><Icon color="teal" name="user outline"/> {authorCount}</Statistic.Value>
                            <Statistic.Label>Authors</Statistic.Label>
                        </Statistic>
                        <Statistic>
                            <Statistic.Value><Icon color="teal" name="file outline"/> {documentCount}</Statistic.Value>
                            <Statistic.Label>Documents</Statistic.Label>
                        </Statistic>
                        <Statistic>
                            <Statistic.Value><Icon color="teal" name="tag"/> {topicCount}</Statistic.Value>
                            <Statistic.Label>Topics</Statistic.Label>
                        </Statistic>
                    </Statistic.Group>
                </Grid.Row>
                <Grid.Row>
                    <Statistic.Group size="small">

                        <Statistic>
                            <Statistic.Value>{avgAuthorPerDocument.toFixed(2)}</Statistic.Value>
                            <Statistic.Label>AVG. Authors per document</Statistic.Label>
                        </Statistic>
                        <Statistic>
                            <Statistic.Value>{parseInt(documentCount / authorCount, 10)}</Statistic.Value>
                            <Statistic.Label>AVG. Documents per author</Statistic.Label>
                        </Statistic>
                        <Statistic>
                            <Statistic.Value>{parseInt(topicCount / authorCount, 10)}</Statistic.Value>
                            <Statistic.Label>AVG. Topics per author</Statistic.Label>
                        </Statistic>

                    </Statistic.Group>
                </Grid.Row>
                <Divider/>
                <Grid.Row>
                    <Statistic.Group size="tiny">
                        <Statistic >
                            <Statistic.Value>{queryCount}</Statistic.Value>
                            <Statistic.Label>Queries</Statistic.Label>
                        </Statistic>
                        <Statistic >
                            <Statistic.Value>{profileViewCount}</Statistic.Value>
                            <Statistic.Label>Profile views</Statistic.Label>
                        </Statistic>
                    </Statistic.Group>
                </Grid.Row>
                <Grid.Row>
                    <Statistic.Group size="mini">
                        <Statistic>
                            {mostFrequentQueries.map((queryText, i) => <Statistic.Value key={i}>{`${queryText.query} (${queryText.count})`}</Statistic.Value>)}
                            <Statistic.Label>Most searched query</Statistic.Label>
                        </Statistic>
                        <Statistic >
                            {mostFrequentTopics.map((queryTopic, i) => <Statistic.Value key={i}>{`${normalizeEntityName(queryTopic.entity_name)} (${queryTopic.count})`}</Statistic.Value>)}
                            <Statistic.Label>Most searched topic</Statistic.Label>
                        </Statistic>
                        <Statistic >
                            {mostFrequentProfiles.map((queryProfile, i) => <Statistic.Value key={i}>{`${queryProfile.author_name} (${queryProfile.count})`}</Statistic.Value>)}
                            <Statistic.Label>Most popular profile</Statistic.Label>
                        </Statistic>
                    </Statistic.Group>
                </Grid.Row>
                <Grid.Row>
                    <Statistic.Group size="tiny"></Statistic.Group>
                </Grid.Row>
                <Grid.Row>
                    <Statistic.Group size="tiny"></Statistic.Group>
                </Grid.Row>
            </Grid>
        );
    }

    render = () => {
        const {loading} = this.state;
        if (loading) {
            return this.renderLoader();
        } else {
            return this.renderStats();
        }
    }
}

export default WiserStatistics;