import React, {Component} from 'react'
import {Header, Image} from 'semantic-ui-react'

import wiserLogo from '../wiser-logo.svg'

const title = "Wiser",
    subtitle = "Wikipedia Expertise Ranking";

class WiserLogo extends Component {

    render = () => {
        return (
            <div
                style={{
                fontFamily: "Roboto",
                display: "flex",
                textAlign: "center",
                marginBottom: 20
            }}>
                <div>
                    <Image src={wiserLogo} size='tiny'/>
                </div>
                <div>
                    <Header as="h1"
                        style={{
                        fontWeight: 300,
                        fontVariant: "small-caps",
                        fontSize: "5rem",
                        marginBottom: -5,
                        marginTop: -22
                    }}>{title}</Header>
                    <Header as="h3" style={{
                        fontWeight: 300,
                        marginTop: -10
                    }}>{subtitle}</Header>
                </div>
            </div>
        );
    }
}

export default WiserLogo;