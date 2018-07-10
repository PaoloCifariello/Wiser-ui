import React, {Component} from 'react'
import {Header, Image} from 'semantic-ui-react'

import wiserLogo from '../../static/wiser-logo.svg'
import unipiLogo from '../../static/unipi-logo-blue.png'

import './WiserLogo.css';

const title = "Wiser",
    subtitle = "Wikipedia Expertise Ranking";

const EXTENDED_LOGO_WITH_UNIPI = false;
class WiserLogo extends Component {

    renderWiserLogo = () => {
        return (
            <div className="wiser-logo-div">
                <div>
                    <Image src={wiserLogo} size='tiny'/>
                </div>
                <div>
                    <Header
                        as="h1"
                        className="wiser-name"
                        style={{
                        fontWeight: 300,
                        fontSize: "5rem",
                        marginBottom: -5,
                        marginTop: -22
                    }}>{title}</Header>
                    <Header
                        as="h3"
                        style={{
                        fontWeight: 300,
                        marginTop: -10
                    }}>{subtitle}</Header>
                </div>
            </div>
        );
    }

    renderMiddleDiv = () => {
        if (!EXTENDED_LOGO_WITH_UNIPI) 
            return;
        
        return (
            <div className="wiser-logo-div wiser-logo-middle-div">
                <Header
                    as="h5"
                    style={{
                    fontWeight: 300,
                    fontSize: "1rem"
                }}>made by</Header>
            </div>
        );
    }

    renderUnipiLogo = () => {
        if (!EXTENDED_LOGO_WITH_UNIPI) 
            return;
        
        return (
            <div className="wiser-logo-div wiser-logo-unipi-div">
                <div>
                    <Image
                        style={{
                        width: 62
                    }}
                        src={unipiLogo}/>
                </div>
                <div>
                    <Header
                        as="h5"
                        style={{
                        color: "#144b7a",
                        fontWeight: 300,
                        fontVariant: "small-caps",
                        fontSize: "1.1rem",
                        marginRight: 10
                    }}>University of Pisa</Header>
                </div>
            </div>
        );
    }
    render = () => {
        return (
            <div className="flex">
                {this.renderWiserLogo()}
                {this.renderMiddleDiv()}
                {this.renderUnipiLogo()}
            </div>
        );
    }
}

export default WiserLogo;