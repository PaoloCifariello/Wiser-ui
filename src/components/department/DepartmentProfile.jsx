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

import DepartmentTopics from './DepartmentTopics'

const menuItems = [
    {
        selector: "topics",
        link: "topics",
        name: "Main topics",
        render: (props) => <DepartmentTopics {...props}/>
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
            departmentName: departmentInformation["name"],
            departmentAuthors: departmentInformation["authors"], 
            num_departmentAuthors: departmentInformation["authors"].length, 
            num_departmentPublications: departmentInformation["publications"], 
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
        const {departmentName, num_departmentAuthors, num_departmentPublications} = this.state;

        return (
            <div>
                <Header as='h1' textAlign="left">{departmentName}
                    <Header.Subheader>
                        {`${num_departmentPublications} publications from ${num_departmentAuthors} authors`}
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
                }
            })}/>)
}
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