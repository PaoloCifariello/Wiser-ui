import React, {Component} from 'react'
import PropTypes from 'prop-types';
import * as d3 from 'd3'
import tooltip from './BubbleChartTooltip'
import {schemeCategory10} from 'd3-scale-chromatic'

export class Bubbles extends Component {
    constructor(props) {
        super(props)
        const {forceStrength, center, group} = props

        this.state = {
            g: null
        }

        this.simulation = d3
            .forceSimulation()
            .velocityDecay(0.2)
            .force('x', d3.forceX().strength(forceStrength).x(center.x))
            .force('y', d3.forceY().strength(forceStrength).y(center.y))
            .force('charge', d3.forceManyBody().strength(this.charge.bind(this)))
            .on('tick', this.ticked.bind(this))
            .stop()

        this.regroupBubbles(group);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.renderBubbles(nextProps.data)
        }
        if (nextProps.group !== this.props.group) {
            this.regroupBubbles(nextProps.group)
        }
    }

    shouldComponentUpdate() {
        // we will handle moving the nodes on our own with d3.js make React ignore this
        // component
        return false
    }

    onRef = (ref) => {
        this.setState({
            g: d3.select(ref)
        }, () => this.renderBubbles(this.props.data))
    }

    ticked() {
        this
            .state
            .g
            .selectAll('.bubble')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
        this
            .state
            .g
            .selectAll('.cluster-topic-label')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
    }

    charge(d) {
        return -this.props.forceStrength * (d.radius ** 2.0)
    }

    regroupBubbles = (group) => {
        const {forceStrength, groupCenters, center} = this.props

        if (group) {
            this
                .simulation
                .force('x', d3.forceX().strength(forceStrength).x(d => groupCenters[d.group].x))
                .force('y', d3.forceY().strength(forceStrength).y(d => groupCenters[d.group].y))
        } else {
            this
                .simulation
                .force('x', d3.forceX().strength(forceStrength).x(center.x))
                .force('y', d3.forceY().strength(forceStrength).y(center.y))
        }
        this
            .simulation
            .alpha(1)
            .restart()
    }

    renderBubbles(data) {
        if (!this.state.g) 
            return;
        
        const bubbles = this
            .state
            .g
            .selectAll('.bubble')
            .data(data, d => d.id)

        // Exit
        bubbles
            .exit()
            .remove()

        // Enter
        const bubblesE = bubbles
            .enter()
            .append('circle')
            .classed('bubble', true)
            .attr('r', 0)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('fill', d => d3.rgb(schemeCategory10[d.group]).brighter())
            .attr('stroke', d => d3.rgb(schemeCategory10[d.group]).darker())
            .attr('stroke-width', 2)
            .on('mouseover', showDetail) // eslint-disable-line
            .on('mouseout', hideDetail) // eslint-disable-line

        const labelsE = bubbles
            .enter()
            .append('text')
            .classed('cluster-topic-label', true)
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .attr('fill', d => d3.rgb(schemeCategory10[d.group]).darker())
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'central')
            .text(d => d.radius > 15
                ? d.name
                : "")
            .on('mouseover', showDetail) // eslint-disable-line
            .on('mouseout', hideDetail) // eslint-disable-line

        bubblesE
            .transition()
            .duration(800)
            .attr('r', d => d.radius)
            .on('end', () => {
                this
                    .simulation
                    .nodes(data)
                    .alpha(1)
                    .restart()
            });
        labelsE
            .transition()
            .duration(800)
            .attr('r', d => d.radius)
            .on('end', () => {
                this
                    .simulation
                    .nodes(data)
                    .alpha(1)
                    .restart()
            });
        // bubblesE.append("text")   .attr("dx", d => -20)   .text(d => d.name)
    }

    render() {
        return (<g
            width={this.props.width}
            height={this.props.height}
            ref={this.onRef}
            className="bubbles"/>)
    }
}

Bubbles.propTypes = {
    center: PropTypes.shape({x: PropTypes.number.isRequired, y: PropTypes.number.isRequired}),
    forceStrength: PropTypes.number.isRequired,
    group: PropTypes.bool.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({x: PropTypes.number.isRequired, id: PropTypes.number.isRequired, radius: PropTypes.number.isRequired, value: PropTypes.number.isRequired, name: PropTypes.string.isRequired}))
}

/*
* Function called on mouseover to display the
* details of a bubble in the tooltip.
*/
export function showDetail(d) {
    // change outline to indicate hover state.
    // d3
    //     .select(this)
    //     .attr('stroke', 'black')

    const content = `<div class="flex"><span class="bubble-chart-name">Topic: </span>&nbsp;<span class="bubble-chart-value">${d.name}</span></div><div class="flex"><span class="bubble-chart-name">Group:&nbsp;</span><div class="bubble-chart-group" 
    style="background-color: ${d3
        .rgb(schemeCategory10[d.group])
        .brighter()}" /></div>`;

    tooltip.showTooltip(content, d3.event)
}

/*
* Hides tooltip
*/
export function hideDetail(d) {
    // reset outline
    // d3
    //     .select(this)
    //     .attr('stroke', d3.rgb(schemeCategory10[d.group]).darker())

    tooltip.hideTooltip()
}