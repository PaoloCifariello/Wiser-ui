import React, {PureComponent} from 'react';
import {Form, List, Select} from 'semantic-ui-react'

import ChordDiagram from 'react-chord-diagram'

import api from '../../api/api'

import {normalizeEntityName} from '../reusable/Entity'
import {range} from 'lodash'

import * as chroma from 'chroma-js';

const colorScale = chroma.brewer.set3.map((c) => chroma(c).saturate(1.5).darken(0.5).hex());

const topEntitiesOptions = range(5, 11).map((value, _) => {
    return {
        key: value,
        value: value,
        text: value.toString()
    }
});

class AuthorTagChordDiagram extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            topEntities: 8
        }
    }

    componentDidMount = () => {
        const {authorId} = this.props.authorInformation;

        api
            .getAuthorTopicsMatrix(authorId)
            .then(this.setAuthorTopicsMatrix)
    }

    setAuthorTopicsMatrix = ({entities, entities_matrix}) => {
        this.setState({entities, entitiesMatrix: entities_matrix})
    }

    handleChange = (e, {value}) => {
        this.setState({topEntities: value});
    }

    renderTagDiagram = () => {
        const {entities, entitiesMatrix, topEntities} = this.state;
        const maxEntityNameLength = 16;

        if (!entitiesMatrix) 
            return;
        
        const restrictedEntitiesMatrix = entitiesMatrix
                .slice(0, topEntities)
                .map((row, _) => row.slice(0, topEntities)),
            restrictedEntities = entities
                .slice(0, topEntities)
                .map((entityName, _) => {
                    let normalizedEntityName = normalizeEntityName(entityName);
                    return normalizedEntityName.length < maxEntityNameLength
                        ? normalizedEntityName
                        : normalizedEntityName.slice(0, maxEntityNameLength - 2) + "..";
                });

        return (<ChordDiagram
            width={1000}
            height={800}
            outerRadius={300}
            innerRadius={280}
            matrix={restrictedEntitiesMatrix}
            componentId={1}
            groupLabels={restrictedEntities}
            groupColors={colorScale}/>);
    }

    renderLegend = () => {
        const {entities, entitiesMatrix, topEntities} = this.state;

        if (!entitiesMatrix) 
            return;
        
        return (
            <div>
                <h4>Topics</h4>
                <List className="align-center" horizontal={true} relaxed={true}>
                    {entities
                        .slice(0, topEntities)
                        .map((entityName, index) => (
                            <List.Item key={`item-${index}`}>
                                <List.Icon
                                    name='circle'
                                    style={{
                                    color: colorScale[index]
                                }}/>
                                <List.Content>{normalizeEntityName(entityName)}</List.Content>
                            </List.Item>
                        ))
}
                </List>
            </div>
        )
    }

    render = () => {
        const {topEntities} = this.state;

        return (
            <div>
                <Form>
                    <Form.Group>
                        <Form.Field
                            control={Select}
                            label='Select how many entities to consider'
                            options={topEntitiesOptions}
                            value={topEntities}
                            onChange={this.handleChange}
                            placeholder='Select how many entities...'/>
                    </Form.Group>
                </Form>
                <div>
                    {this.renderTagDiagram()}
                    {this.renderLegend()}
                </div>
            </div>
        );
    }
}

export default AuthorTagChordDiagram;