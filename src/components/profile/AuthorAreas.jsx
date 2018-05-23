import { range } from 'lodash';
import React, { Component } from 'react';
import { Card, Form, Select } from 'semantic-ui-react';
import api from '../../api/api';
import { BubbleChart } from "../reusable/BubbleChart";
import { normalizeEntityName } from '../reusable/Entity';

const TOP_ENTITIES_PER_CLUSTER = 8;

const kSteps = range(1, 20).map((value) => {
    return {
        key: value,
        value: value,
        text: value.toString()
    }
});

class AuthorAreas extends Component {
    constructor(props) {
        super(props);

        this.state = {
            k: 4,
            authorAreas: []
        }
    }

    componentDidMount = () => {
        const { authorId } = this.props.authorInformation;
        const { k } = this.state;

        api
            .getAuthorAreas(authorId, k)
            .then(this.setAuthorAreas)
    }

    componentDidUpdate = (_, prevState) => {
        const { authorId } = this.props.authorInformation;
        const previousK = prevState.k,
            actualK = this.state.k;

        if (actualK !== previousK) {
            api
                .getAuthorAreas(authorId, actualK)
                .then(this.setAuthorAreas)
        }
    }

    setAuthorAreas = (data) => {
        this.setState({
            authorAreas: data
                .clusters
                .map((area) => {
                    var importanceSum = area.reduce((acc, currentEntity) => (acc["importance_score"]
                        ? acc["importance_score"]
                        : acc) + currentEntity["importance_score"]);
                    return {
                        importanceScore: importanceSum / area.length,
                        topics: area.sort((a, b) => b.importance_score - a.importance_score)
                    };
                })
                .sort((a, b) => b.importanceScore - a.importanceScore)
        });
    }

    handleChange = (e, { value }) => {
        this.setState({ k: value });
    }

    // renderAuthorArea = (area, i) => {
    //     const { authorId } = this.props.authorInformation;

    //     return (
    //         <Card key={i}>
    //             <Card.Meta>
    //                 {area.importanceScore}
    //             </Card.Meta>
    //             <Card.Description>
    //                 {/* {area
    //                     .topics
    //                     .map((entity) => <EntityLink
    //                         authorId={authorId}
    //                         entityId={entity.entity_id}
    //                         entityName={entity.entity_name}/>)} */}
    //                 {area
    //                     .topics
    //                     .slice(0, 5)
    //                     .map((entity) => normalizeEntityName(entity.entity_name))
    //                     .join("\n")}
    //             </Card.Description>
    //         </Card>
    //     );
    //     return area[0].entity_name;
    // }

    render = () => {
        const { authorAreas, k } = this.state,
            normalizedAuthorTopics = authorAreas.map((area, i) => area.topics.slice(0, TOP_ENTITIES_PER_CLUSTER).map((topic, _) => {
                return {
                    id: topic.entity_id,
                    title: normalizeEntityName(topic.entity_name),
                    value: topic.importance_score,
                    group: i
                };
            }));

        return (<BubbleChart
            data={normalizedAuthorTopics}
            width={960}
            height={640}
            group={true} />)
    }

    // render_ = () => {
    //     const { authorAreas, k } = this.state;

    //     return (
    //         <div>
    //             <Form>
    //                 <Form.Group>
    //                     <Form.Field
    //                         control={Select}
    //                         label='Select how many areas to consider'
    //                         options={kSteps}
    //                         value={k}
    //                         onChange={this.handleChange}
    //                         placeholder='Select how many areas...' />
    //                 </Form.Group>
    //             </Form>
    //             <Card.Group>
    //                 {authorAreas.map((area, i) => this.renderAuthorArea(area, i))}
    //             </Card.Group>
    //         </div>
    //     )
    // }
}

export default AuthorAreas;