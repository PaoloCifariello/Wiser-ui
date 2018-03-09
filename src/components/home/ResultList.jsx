import React, {Component} from 'react'
import {LinkContainer} from 'react-router-bootstrap'

import {Card, List, Grid} from 'semantic-ui-react'

class ResultList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: props.results
        };
    }

    showResults() {
        return (
            <List size="big">
                {this
                    .state
                    .results
                    .map((author, index) => {
                        return (
                            <List.Item key={index} className="align-center">
                                <LinkContainer to={`/profile/${author.author_id}`}>
                                    <List.Content verticalAlign='middle'>
                                        <Card
                                            fluid
                                            header={author.name}
                                            meta='Università di Pisa'/>
                                    </List.Content>
                                </LinkContainer>
                            </List.Item>
                        );
                    })
}
            </List>
        );
    }

    render() {
        return (
            <Grid className="margin-top15" textAlign='left' columns={3}>
                <Grid.Row>
                    <Grid.Column></Grid.Column>
                    <Grid.Column>
                        {this.showResults()}
                    </Grid.Column>
                    <Grid.Column></Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default ResultList;