import React, {Component} from 'react';
import {
  Divider,
  Grid,
  Header,
  Message,
  Segment,
  Tab
} from 'semantic-ui-react'

import api from '../../api/api'

import AuthorTopics from './AuthorTopics'
import AuthorPublications from './AuthorPublications'
import AuthorWordcloud from './AuthorWordcloud'
import AuthorSurvey from './AuthorSurvey'

class AuthorProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorId: this.props.match.params.authorId,
      isLoaded: false,
      showErrorMessage: false
    }
  }

  componentDidMount() {
    const {authorId} = this.state;
    api
      .getAuthorProfile(authorId)
      .then((res) => this.updateAuthorInformation(res.data))
      .catch(this.fail)
  }

  fail = () => {
    this.setState({showErrorMessage: true});
  }
  updateAuthorInformation = (authorInformation) => {
    this.setState({authorName: authorInformation["name"], authorInstitution: authorInformation["institution"], authorYears: authorInformation["years"], isLoaded: true})
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
    const {authorName, authorInstitution, authorYears} = this.state;
    const sortedAuthorYears = Object.keys(authorYears).sort();

    return (
      <div>
        <Header as='h1' textAlign="left">{authorName}
          <Header.Subheader>
            {authorInstitution}
          </Header.Subheader>
          <Header.Subheader>
            {`${sortedAuthorYears[0]} - ${sortedAuthorYears[sortedAuthorYears.length - 1]}`}
          </Header.Subheader>
        </Header>
      </div>
    );
  }
  renderAuthorProfile = () => {
    const {authorId, authorYears} = this.state;

    const panes = [
      {
        menuItem: 'Main topics',
        render: () => <Tab.Pane attached={true}><AuthorTopics authorId={authorId}/></Tab.Pane>
      }, {
        menuItem: 'Publications',
        render: () => <Tab.Pane attached={false}><AuthorPublications
            authorInformation={{
            authorId,
            authorYears
          }}/></Tab.Pane>
      }, {
        menuItem: 'Wordcloud',
        render: () => <Tab.Pane attached={false}><AuthorWordcloud authorInformation={{authorId, authorYears}}/></Tab.Pane>
      }, {
        menuItem: 'Survey',
        render: () => <Tab.Pane attached={false}><AuthorSurvey authorId={authorId}/></Tab.Pane>
      }
    ];

    return (
      <Grid columns='equal'>
        <Grid.Column/>
        <Grid.Column width={10}>
          <Segment basic>
            {this.renderAuthorInfo()}
            <Divider/>
            <Tab
              menu={{
              secondary: true,
              pointing: true
            }}
              panes={panes}/>
          </Segment>
        </Grid.Column>
        <Grid.Column/>
      </Grid>
    );
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