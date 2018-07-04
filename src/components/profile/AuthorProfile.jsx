import React, {Component} from 'react';
import {
    Divider,
    Grid,
    Header,
    Message,
    Menu,
    Segment
} from 'semantic-ui-react'

import {NavLink, Switch, Redirect, Route} from 'react-router-dom'
import api from '../../api/api'
import AUTHOR_ROLE from '../reusable/AuthorRole'

import AuthorTopics from './AuthorTopics'
import AuthorAreas from './AuthorAreas'
import AuthorPublications from './AuthorPublications'
import AuthorTagcloud from './AuthorTagcloud'
import AuthorSurvey from './AuthorSurvey'
import AuthorPublication from './AuthorPublication'
import AuthorStreamGraph from './AuthorStreamGraph'
import AuthorTagChordDiagram from './AuthorTagChordDiagram'

const menuItems = [
    {
        selector: "topics",
        link: "topics",
        name: "Main topics",
        disabled: false,
        render: (props) => <AuthorTopics {...props}/>
    }, {
        selector: "areas",
        link: "areas",
        name: "Main areas",
        disabled: false,
        render: (props) => <AuthorAreas {...props}/>
    }, {
        selector: "streamgraph",
        link: "streamgraph",
        name: "StreamGraph",
        disabled: false,
        render: (props) => <AuthorStreamGraph {...props}/>
    }, {
        selector: "tagcloud",
        link: "tagcloud",
        name: "TagCloud",
        disabled: false,
        render: (props) => <AuthorTagcloud {...props}/>
    }, {
        selector: "chorddiagram",
        link: "chorddiagram",
        name: "Chord Diagram",
        disabled: false,
        render: (props) => <AuthorTagChordDiagram {...props}/>
    }, {
        selector: "publications/:entity_id_filter?",
        link: "publications",
        name: "Publications",
        disabled: false,
        render: (props) => <AuthorPublications {...props}/>
    }, {
        selector: "survey",
        link: "survey",
        name: "Survey",
        disabled: true,
        render: (props) => <AuthorSurvey {...props}/>
    }
];
class AuthorProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authorId: this.props.match.params.authorId,
            isLoaded: false,
            showErrorMessage: false
        }
    }

    componentDidMount = () => {
        const {authorId} = this.state;

        api
            .getAuthorProfile(authorId)
            .then(this.updateAuthorInformation)
            .catch(this.fail)
    }

    componentDidUpdate = (prevProps) => {
        const newAuthorId = this.props.match.params.authorId,
            prevAuthorId = prevProps.match.params.authorId;

        if (newAuthorId !== prevAuthorId) {
            this.setState({authorId: newAuthorId, isLoaded: false, showErrorMessage: false});
            api
                .getAuthorProfile(newAuthorId)
                .then(this.updateAuthorInformation)
                .catch(this.fail)
        }
    }

    fail = () => {
        this.setState({showErrorMessage: true});
    }
    updateAuthorInformation = (authorInformation) => {
        this.setState({
            authorName: authorInformation["name"],
            authorRole: AUTHOR_ROLE[authorInformation["role"]],
            authorInstitution: authorInformation["institution"],
            authorYears: authorInformation["years"],
            isLoaded: true
        })
    }

    renderErrorMessage = () => {
        return (
            <div className="margin-top15 align-center">
                <Message
                    compact
                    negative
                    header='Error!'
                    content='Failed to retrieve author information. Please try again.'/>
            </div>
        );
    }

    renderAuthorInfo = () => {
        const {authorName, authorRole, authorInstitution, authorYears} = this.state;

        const sortedAuthorYears = Object
            .keys(authorYears)
            .sort();
        const authorPublications = Object
            .values(authorYears)
            .reduce((accumulator, el) => accumulator + el)
        return (
            <div>
                <Header as='h1' textAlign="left">{authorName}
                    <Header.Subheader>
                        {authorRole}
                    </Header.Subheader>
                    <Header.Subheader>
                        {authorInstitution}
                    </Header.Subheader>
                    <Header.Subheader>
                        {`${authorPublications} publications from ${sortedAuthorYears[0]} to ${sortedAuthorYears[sortedAuthorYears.length - 1]}`}
                    </Header.Subheader>
                </Header>
            </div>
        );
    }
    renderAuthorProfile = () => {
        return (
            <Grid centered stackable>
                <Grid.Column/>
                <Grid.Column
                    mobile={16}
                    tablet={16}
                    computer={12}
                    largeScreen={11}
                    widescreen={10}>
                    <Segment basic>
                        {this.renderAuthorInfo()}
                        <Divider/> {this.renderAuthorMenu()}
                        <Divider/> {this.renderAuthorSection()}
                    </Segment>
                </Grid.Column>
                <Grid.Column/>
            </Grid>
        );
    }

    renderAuthorMenu = () => {
        const {
            section = "topics",
            authorId
        } = this.props.match.params;

        return (
            <div>
                <Menu pointing secondary>
                    {menuItems.map(({
                        link,
                        name,
                        disabled
                    }, index) => {
                        return (disabled)
                            ? <Menu.Item key={index} disabled={disabled} name={name}/>
                            : <Menu.Item
                                key={index}
                                as={NavLink}
                                to={`/profile/${authorId}/${link}`}
                                name={name}
                                active={section === link}/>

                    })}
                </Menu>
            </div>
        )
    }

    renderAuthorSection = () => {
        const {authorId} = this.props.match.params;
        const {authorYears} = this.state;

        return <Switch>
            <Route
                exact
                path={`/profile/:authorId`}
                render={() => (<Redirect to={`/profile/${authorId}/topics`}/>)}/> {menuItems.map(({
                selector,
                render
            }, index) => <Route
                key={selector}
                exact
                path={`/profile/:authorId/${selector}`}
                render={(props) => render({
                ...props,
                authorInformation: {
                    authorId,
                    authorYears
                }
            })}/>)
}
            <Route
                exact
                key="publication"
                path={`/profile/:authorId/publication/:publicationId`}
                component={AuthorPublication}/>
        </Switch>

    }
    render() {
        const {isLoaded, showErrorMessage} = this.state;

        if (showErrorMessage) 
            return this.renderErrorMessage();
        
        if (!isLoaded) 
            return null;
        else 
            return this.renderAuthorProfile()
    }
}

export default AuthorProfile;