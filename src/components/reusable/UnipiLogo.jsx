import React, {Component} from 'react'

import {Image} from 'semantic-ui-react';

import unipiLogo from '../../static/unipi-logo-white.png'

class UnipiLogo extends Component {
    render = () => (
        <div
            style={{
            alignItems: "center",
            marginTop: 1,
            marginLeft: 100
        }}
            className="flex">
            <Image
                style={{
                width: 60,
                height: 60
            }}
                src={unipiLogo}/>
            <span
                style={{
                color: "#e0f2f1",
                fontWeight: 300,
                fontVariant: "small-caps",
                fontSize: "1.1rem",
                marginLeft: 15
            }}>University of Pisa</span>
        </div>
    )
}

export default UnipiLogo;