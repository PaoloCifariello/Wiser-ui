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
            .then((res) => {
                const data = res.data;
                this.setState({
                    documentCount: data.document_count,
                    authorCount: data.author_count,
                    topicCount: data.topic_count,
                    queryCount: data.query_count,
                    profileViewCount: data.profile_view_count,
                    queryText: data.query_text,
                    queryTopic: data.query_topic,
                    queryProfile: data.query_profile,
                    loading: false
                })
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
            profileViewCount,
            queryText,
            queryTopic,
            queryProfile
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
                    <Statistic.Group size="tiny">
                        <Statistic >
                            <Statistic.Value>{`${queryText.text} (${queryText.count})`}</Statistic.Value>
                            <Statistic.Label>Most searched query</Statistic.Label>
                        </Statistic>
                        <Statistic >
                            <Statistic.Value>{`${normalizeEntityName(queryTopic.topic_name)} (${queryTopic.count})`}</Statistic.Value>
                            <Statistic.Label>Most searched topic</Statistic.Label>
                        </Statistic>
                        <Statistic >
                            <Statistic.Value>{`${queryProfile.author_name} (${queryProfile.count})`}</Statistic.Value>
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