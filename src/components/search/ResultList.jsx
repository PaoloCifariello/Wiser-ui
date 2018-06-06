import React, {Component} from 'react'
import {LinkContainer} from 'react-router-bootstrap'

import {Card, List} from 'semantic-ui-react'

import './ResultList.css'

class ResultList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: props.results
        };
    }

    renderResult = (result, index) => {
        const profileLink = result.author_id ? `/profile/${result.author_id}` : `/department/${result.id}`
        return (
            <List.Item key={index} className="align-center">
                <LinkContainer to={profileLink}>
                    <List.Content verticalAlign='middle'>
                        <Card className="result-card">
                            <Card.Content>
                                <Card.Header>
                                    {result.name}
                                </Card.Header>
                                <Card.Meta>
                                    <span>
                                        Università di Pisa
                                    </span>
                                </Card.Meta>
                                <Card.Description></Card.Description>
                            </Card.Content>
                        </Card>
                    </List.Content>
                </LinkContainer>
            </List.Item>
        );
    }

    render = () => {
        const {results} = this.state
        return (
            <List size="big">
                {results.map(this.renderResult)}
            </List>
        );
    }
}

export default ResultList;