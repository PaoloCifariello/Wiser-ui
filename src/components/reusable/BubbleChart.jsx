import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {Bubbles} from './Bubbles'

import * as d3 from 'd3'
import {range} from 'lodash'

import './BubbleChart.css'
//TODO: compute them automatically

export class BubbleChart extends Component {

    static defaultProps = {
        forceStrength: 0.017,
        group: false,
        maxRadius: 65
    }

    constructor(props) {
        super(props);

        this.svgRef = React.createRef();
        this.state = {
            data: []
        }
    }

    computeGroupCenters = (data) => {
        if (!this.svgRef.current) {
            return {groupCenters: [], width: window.innerWidth, height: window.innerHeight};
        }
        let svgWidth = this.svgRef.current.clientWidth;

        const WINDOWS_WIDTH = window.innerWidth,
            STACK_WIDTH_BREAKPOINT = 992,
            TOP_MARGIN = 300,
            SINGLE_CLUSTER_HEIGHT = 250,
            IS_STACKED = WINDOWS_WIDTH <= STACK_WIDTH_BREAKPOINT,
            TOTAL_WIDTH = svgWidth,
            CLUSTER_PER_ROW = IS_STACKED
                ? 2
                : 3,
            TOTAL_HEIGHT = TOP_MARGIN + Math.ceil(data.length / CLUSTER_PER_ROW) * SINGLE_CLUSTER_HEIGHT,
            SINGLE_CLUSTER_WIDTH = TOTAL_WIDTH / CLUSTER_PER_ROW;

        const GROUP_CENTERS = range(0, 20).map((i) => ({
            index: i,
            x: SINGLE_CLUSTER_WIDTH / 2 + (SINGLE_CLUSTER_WIDTH * (i % CLUSTER_PER_ROW)),
            y: TOP_MARGIN + Math.floor(i / CLUSTER_PER_ROW) * SINGLE_CLUSTER_HEIGHT

        })).reduce((obj, item) => {
            obj[item.index] = {
                x: item.x,
                y: item.y
            }
            return obj;
        }, {});

        return {groupCenters: GROUP_CENTERS, width: svgWidth, height: TOTAL_HEIGHT}
    }

    render = () => {
        const {forceStrength, group, maxRadius, data} = this.props;

        const {groupCenters, width, height} = this.computeGroupCenters(data);

        return (
            <svg ref={this.svgRef} className="bubbleChart" width="100%" height={height}>
                <Bubbles
                    width={width}
                    height={height}
                    data={createNodes([].concat.apply([], data), maxRadius)}
                    onGroupClick={this.props.onGroupClick}
                    forceStrength={forceStrength}
                    center={{
                    x: width / 2,
                    y: height / 2
                }}
                    groupCenters={groupCenters}
                    group={group}/>
            </svg>
        )
    }
}

BubbleChart.propTypes = {
    forceStrength: PropTypes.number,
    group: PropTypes.bool
}

export function createNodes(rawData, maxRadius) {
    // Use the max total_amount in the data as the max in the scale's domain note we
    // have to ensure the total_amount is a number.
    const maxAmount = d3.max(rawData, d => + d.value),
        maxGroupImportance = d3.max(rawData, d => + d.groupImportance)

    // Sizes bubbles based on area. @v4: new flattened scale names.
    const radiusScale = d3
        .scalePow()
        .exponent(0.8)
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
        groupImportance: d.groupImportance / maxGroupImportance,
        x: radiusScale(+ d.value) + Math.random() * (900 - radiusScale(+ d.value)),
        y: radiusScale(+ d.value) + Math.random() * (800 - radiusScale(+ d.value))
    }))

    // sort them descending to prevent occlusion of smaller nodes.
    myNodes.sort((a, b) => b.value - a.value)

    return myNodes
}