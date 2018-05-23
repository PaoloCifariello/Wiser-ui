import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {Bubbles} from './Bubbles'

import * as d3 from 'd3'

import './BubbleChart.css'

//TODO: compute them automatically
var groupCenters = {
    0: {
        x: 150,
        y: 200
    },
    1: {
        x: 350,
        y: 200
    },
    2: {
        x: 550,
        y: 200
    },
    3: {
        x: 750,
        y: 200
    }
};

export class BubbleChart extends Component {

    static defaultProps = {
        forceStrength: 0.017,
        group: false,
        maxRadius: 65
    }

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    render = () => {
        const {width, height, forceStrength, group, maxRadius, data} = this.props;

        return (
            <svg className="bubbleChart" width={width} height={height}>
                <Bubbles
                    data={createNodes([].concat.apply([], data), maxRadius)}
                    forceStrength={forceStrength}
                    center={{
                    x: 960 / 2,
                    y: 640 / 2
                }}
                    groupCenters={groupCenters}
                    group={group}/>
            </svg>
        )
    }
}

BubbleChart.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    forceStrength: PropTypes.number,
    group: PropTypes.bool
}

export function createNodes(rawData, maxRadius) {
    // Use the max total_amount in the data as the max in the scale's domain note we
    // have to ensure the total_amount is a number.
    const maxAmount = d3.max(rawData, d => + d.value)

    // Sizes bubbles based on area. @v4: new flattened scale names.
    const radiusScale = d3
        .scalePow()
        .exponent(0.9)
        .range([1, maxRadius])
        .domain([0, maxAmount])

    // Use map() to convert raw data into node data. Checkout
    // http://learnjsdata.com/ for more on working with data.
    const myNodes = rawData.map(d => ({
        id: d.id,
        radius: radiusScale(+ d.value),
        value: + d.value,
        name: d.title,
        group: d.group,
        x: radiusScale(+ d.value) + Math.random() * (900 - radiusScale(+ d.value)),
        y: radiusScale(+ d.value) + Math.random() * (800 - radiusScale(+ d.value))
    }))

    // sort them descending to prevent occlusion of smaller nodes.
    myNodes.sort((a, b) => b.value - a.value)

    return myNodes
}