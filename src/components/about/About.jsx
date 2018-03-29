import React, {Component} from 'react';

import {Grid} from 'semantic-ui-react';

import "./About.css"

import WiserLogo from '../reusable/WiserLogo';

const projectTitle = `Un motore di ricerca semantico per la valorizzazione della ricerca e il trasferimento 
      tecnologico dell’Università di Pisa`,
  myMail = <a href="mailto:paolocifa@gmail.com">Paolo Cifariello</a>,
  ferraMail = <a href="mailto:paolo.ferragina@unipi.it">Paolo Ferragina</a>,
  acubeLink = <a href="http://acube.di.unipi.it/" target="_blank" rel="noopener noreferrer">@Acube Lab 2016-2017</a>;

class About extends Component {
  render() {
    return (
      <Grid centered stackable className="margin-top15" textAlign='center'>
        <Grid.Row >
          <WiserLogo/>
        </Grid.Row>
        <Grid.Row>
          <div className="about-contianer">
            <div className="about">
              <span>
                This system is being developed by Acube Lab (at the Department of Computer Science of the University of Pisa).
                <br /> 
                It is partially sponsored by MIUR project FFO 2016 (DM 6 luglio 2016, n. 552, art. 11) titled:
                <br />
                <br />
                <i className="project-title">“{projectTitle}”</i>.
                <br />
              </span>
              <br/>
              <br/>
              <span>For any info please write an email to {myMail}&nbsp;or&nbsp;{ferraMail}.
                <br/>
                <br/> {acubeLink}
              </span>
            </div>
          </div>
        </Grid.Row>
      </Grid>
    );
  }
}

export default About;