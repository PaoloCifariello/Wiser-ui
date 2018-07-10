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

import Publication from '../reusable/Publication'
import DepartmentAreas from './DepartmentAreas';
import DepartmentTopics from './DepartmentTopics';
import DepartmentStreamGraph from './DepartmentStreamGraph';
import DepartmentPublications from './DepartmentPublications';

const menuItems = [
    {
        selector: "topics",
        link: "topics",
        name: "Main topics",
        render: (props) => <DepartmentTopics {...props}/>
    }, {
        selector: "areas",
        link: "areas",
        name: "Main areas",
        render: (props) => <DepartmentAreas {...props}/>
    }, {
        selector: "streamgraph",
        link: "streamgraph",
        name: "StreamGraph",
        render: (props) => <DepartmentStreamGraph {...props}/>
    }, {
        selector: "publications/:entity_id_filter?",
        link: "publications",
        name: "Publications",
        disabled: false,
        render: (props) => <DepartmentPublications {...props}/>
    }
];
class DepartmentProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            showErrorMessage: false
        }
    }

    componentDidMount() {
        const {departmentName} = this.props.match.params;

        api
            .getDepartmentProfile(departmentName)
            .then(this.updateDepartmentInformation)
            .catch(this.fail)
    }

    fail = () => {
        this.setState({showErrorMessage: true});
    }

    updateDepartmentInformation = (departmentInformation) => {
        this.setState({
            departmentName: departmentInformation["department_name"],
            numDepartmentAuthors: departmentInformation["n_authors"],
            numDepartmentPublications: departmentInformation["n_documents"],
            departmentYears: departmentInformation["years"],
            firstYear: departmentInformation["first_year"],
            lastYear: departmentInformation["last_year"],
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

    renderDepartmentInfo = () => {
        const {departmentName, numDepartmentAuthors, numDepartmentPublications, firstYear, lastYear} = this.state;

        return (
            <div>
                <Header as='h1' textAlign="left">{departmentName}
                    <Header.Subheader>
                        {`${numDepartmentPublications} publications from ${numDepartmentAuthors} authors`}
                    </Header.Subheader>
                    <Header.Subheader>
                        {`${firstYear} - ${lastYear}`}
                    </Header.Subheader>
                </Header>
            </div>
        );
    }

    renderDepartmentProfile = () => {
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
                        {this.renderDepartmentInfo()}
                        <Divider/> {this.renderDepartmentMenu()}
                        <Divider/> {this.renderDepartmentSection()}
                    </Segment>
                </Grid.Column>
                <Grid.Column/>
            </Grid>
        );
    }

    renderDepartmentMenu = () => {
        const {
            section = "topics"
        } = this.props.match.params;

        const {departmentName} = this.state;

        return (
            <div>
                <Menu pointing secondary>
                    {menuItems.map(({
                        link,
                        name
                    }, index) => {
                        return <Menu.Item
                            key={index}
                            as={NavLink}
                            to={`/department/${departmentName}/${link}`}
                            name={name}
                            active={section === link}/>
                    })}
                </Menu>
            </div>
        )
    }

    renderDepartmentSection = () => {
        const {departmentName} = this.props.match.params;
        const {departmentYears} = this.state;

        return <Switch>
            <Route
                exact
                path={`/department/:departmentName`}
                render={() => (<Redirect to={`/department/${departmentName}/topics`}/>)}/> {menuItems.map(({
                selector,
                render
            }, index) => <Route
                key={selector}
                exact
                path={`/department/:departmentName/${selector}`}
                render={(props) => render({
                ...props,
                departmentInformation: {
                    departmentName: departmentName,
                    departmentYears: departmentYears
                }
            })}/>)
}

            <Route
                exact
                key="publication"
                path={`/department/:departmentName/publication/:publicationId`}
                component={Publication}/>
        </Switch>

    }
    render() {
        const {isLoaded, showErrorMessage} = this.state;

        if (showErrorMessage) 
            return this.renderErrorMessage();
        
        if (!isLoaded) 
            return null;
        else 
            return this.renderDepartmentProfile()
    }
}

export default DepartmentProfile;