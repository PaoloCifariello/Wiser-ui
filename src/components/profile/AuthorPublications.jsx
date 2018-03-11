import React, {Component} from 'react';
import {
    Grid,
    Label,
    Menu,
} from 'semantic-ui-react'

import AuthorPublicationList from './AuthorPublicationList'

import './AuthorPublications.css'

class AuthorPublications extends Component {
    constructor(props) {
        super(props);
        const {authorId, authorYears} = this.props.authorInformation;
        const sortedAuthorYears = Object
            .keys(authorYears)
            .sort((a, b) => b - a);

        this.state = {
            authorId: authorId,
            authorYears: authorYears,
            selectedYear: sortedAuthorYears[0]
        }
    }


    handleItemClick = (e, {year}) => this.setState({selectedYear: year})

    handleContextRef = contextRef => this.setState({contextRef})

    renderMenu = () => {
        const {selectedYear, authorYears} = this.state
        const sortedAuthorYears = Object
            .keys(authorYears)
            .sort((a, b) => b - a);

        return (
            <Menu size='small' vertical>
                {sortedAuthorYears.map((year, index) => <Menu.Item
                    year={year}
                    active={selectedYear === year}
                    onClick={this.handleItemClick}>
                    <Label color={selectedYear === year ? "teal": "grey"}>{authorYears[year]}</Label>
                    {year}
                </Menu.Item>)}
            </Menu>
        );
    }

    render = () => {
        const {authorId, selectedYear} = this.state;

        return (
            <Grid centered columns={2}>
                {/* <Grid.Row> */}
                <Grid.Column floated='left' width={4}>
                    <div ref={this.handleContextRef}>
                        {this.renderMenu()}
                    </div>
                </Grid.Column>
                <Grid.Column floated='left' width={12}>
                    <AuthorPublicationList authorId={authorId} publicationsYear={selectedYear}/>
                    {/* <List>{this.renderPublicationsList()}</List > */}
                </Grid.Column>
                {/* </Grid.Row> */}
            </Grid>
        );
    }
}

export default AuthorPublications;