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
    this.setState({authorName: authorInformation["name"], authorInstitution: authorInformation["institution"], isLoaded: true})
  }

  renderErrorMessage = () => {
    return (
      <div className="margin-top15">
        <Message
          compact
          negative
          header='Error!'
          content='Failed to retrieve author information. Please try again.'/>
      </div>
    );
  }

  renderAuthorInfo = () => {
    const {authorName, authorInstitution} = this.state;
    return (
      <div>
        <Header as='h1' textAlign="left">{authorName}
          <Header.Subheader>
            {authorInstitution}
          </Header.Subheader>
        </Header>
      </div>
    );
  }
  renderAuthorProfile = () => {
    const {authorId} = this.state;

    const panes = [
      {
        menuItem: 'Topics',
        render: () => <Tab.Pane attached={true}><AuthorTopics authorId={authorId}/></Tab.Pane>
      }, {
        menuItem: 'Publications',
        render: () => <Tab.Pane attached={false}><AuthorPublications authorId={authorId}/></Tab.Pane>
      }, {
        menuItem: 'Wordcloud',
        render: () => <Tab.Pane attached={false}><AuthorWordcloud authorId={authorId}/></Tab.Pane>
      }, {
        menuItem: 'Survey',
        render: () => <Tab.Pane attached={false}><AuthorSurvey authorId={authorId}/></Tab.Pane>
      }
    ];

    return (
      <Grid columns='equal'>
        <Grid.Column/>
        <Grid.Column width={10}>
          <Segment>
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