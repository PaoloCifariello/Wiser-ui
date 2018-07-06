import React, {Component} from 'react'

import {
    Divider,
    Grid,
    Header,
    Icon,
    Loader,
    Statistic
} from 'semantic-ui-react'
import WiserLogo from '../reusable/WiserLogo';

import {range} from 'lodash';
import api from '../../api/api'
import {normalizeEntityName} from '../reusable/Entity'

import * as moment from 'moment';
import {BarChart, Bar, XAxis, YAxis} from 'recharts';

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

    formatTimeUsageData = (fromTimestamp, data) => {
        let usageData = range(0, 7).map((dayFromStarting) => ({
            day: moment()
                .subtract(6 - dayFromStarting, 'd')
                .format("D/M"),
            usage: 0
        }));

        fromTimestamp = moment.unix(fromTimestamp);
        data.forEach((usage) => {
            const daysFromStarting = moment
                .unix(usage)
                .diff(fromTimestamp, 'days', false);
            usageData[daysFromStarting].usage += 1;
        })

        return usageData;
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
            query_usage: this.formatTimeUsageData(data.usage.from, data.usage.query_usage),
            profile_usage: this.formatTimeUsageData(data.usage.from, data.usage.profile_usage),
            loading: false
        });
    }

    renderLoader = () => {
        return <Loader active inline='centered'/>
    }

    rendereUsageGraph = () => {
        const {query_usage, profile_usage} = this.state;

        return (
            <Grid.Row>
                <div>
                    <Header size='medium'>Queries during last week</Header>
                    <BarChart width={400} height={160} data={query_usage}>
                        <XAxis dataKey="day"/> {/* <Tooltip/> */}
                        <YAxis dataKey="usage"/>
                        <Bar dataKey='usage' fill='#8884d8'/>
                    </BarChart>
                </div>
                <div>
                    <Divider hidden vertical/>
                    <Divider hidden vertical/>
                </div>
                <div>
                    <Header size='medium'>Profile views during last week</Header>
                    <BarChart width={400} height={160} data={profile_usage}>
                        <XAxis dataKey="day"/> {/* <Tooltip/> */}
                        <YAxis dataKey="usage"/>
                        <Bar dataKey='usage' fill='#8884d8'/>
                    </BarChart>
                </div>
            </Grid.Row>
        );
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
                {this.rendereUsageGraph()}
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