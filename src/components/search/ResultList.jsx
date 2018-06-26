import React, {PureComponent, Component} from 'react'
import {LinkContainer} from 'react-router-bootstrap'

import {Card, List} from 'semantic-ui-react'

import './ResultList.css'
import AUTHOR_ROLE from '../reusable/AuthorRole'

class ResultList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: props.results
        };
    }

    render = () => {
        const {results} = this.state
        return (
            <List size="big">
                {results.map((result, index) => <Result key={index} result={result}/>)}
            </List>
        );
    }
}

class Result extends PureComponent {

    renderMeta = () => {
        const {result} = this.props;

        return (
            <Card.Meta>
                <span>
                    {AUTHOR_ROLE[result.role]}
                </span>
            </Card.Meta>
        );
    }

    renderExtraContent = () => {
        const {result} = this.props;

        if (result.role) {
            return (
                <Card.Content extra>
                    <span>
                        {result.institution}
                    </span>
                </ Card.Content>
            );
        }
    }

    render = () => {
        const {result} = this.props;
        const profileLink = result.author_id
            ? `/profile/${result.author_id}`
            : `/department/${result.id}`
        return (
            <List.Item className="align-center">
                <LinkContainer to={profileLink}>
                    <List.Content verticalAlign='middle'>
                        <Card className="result-card">
                            <Card.Content>
                                <Card.Header>
                                    {result.name}
                                </Card.Header>
                                {this.renderMeta()}
                                <Card.Description></Card.Description>
                            </Card.Content>
                            {this.renderExtraContent()}
                        </Card>
                    </List.Content>
                </LinkContainer>
            </List.Item>
        );
    }
}

export default ResultList;