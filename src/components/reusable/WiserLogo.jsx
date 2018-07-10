import React, {Component} from 'react'
import {Header, Image} from 'semantic-ui-react'

import wiserLogo from '../../static/wiser-logo.svg'
import unipiLogo from '../../static/unipi-logo.png'

import './WiserLogo.css';

const title = "Wiser",
    subtitle = "Wikipedia Expertise Ranking";

class WiserLogo extends Component {

    render = () => {
        return (
            <div className="flex">
                <div className="wiser-logo-div">
                    <div>
                        <Image src={wiserLogo} size='tiny'/>
                    </div>
                    <div>
                        <Header
                            as="h1"
                            style={{
                            fontWeight: 300,
                            fontVariant: "small-caps",
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
                <div className="wiser-logo-div wiser-logo-middle-div">
                    <Header
                        as="h5"
                        style={{
                        fontWeight: 300,
                        fontSize: "1rem"
                    }}>made by</Header>
                </div>
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
            </div>
        );
    }
}

export default WiserLogo;