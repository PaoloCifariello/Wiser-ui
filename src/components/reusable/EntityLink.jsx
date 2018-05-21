import React, {PureComponent} from 'react';
import {Popup} from 'semantic-ui-react';

import {normalizeEntityName} from "../reusable/Entity"
import wiki_api from '../../api/wiki_api';

class EntityLink extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            popupSummary: null
        }
    }

    componentDidMount = () => {
        const {entityName} = this.props;

        wiki_api
            .getSummary(entityName)
            .then((popupSummary) => {
                this.setState({popupSummary: popupSummary})
            })
    }

    componentWillReceiveProps = () => {
        this.setState({popupSummary: null});
    }

    componentDidUpdate = () => {
        const {entityName} = this.props;

        wiki_api
            .getSummary(entityName)
            .then((popupSummary) => {
                this.setState({popupSummary: popupSummary})
            })
    }

    renderEntityLink = () => {
        const {authorId, entityId, entityName} = this.props;

        return (authorId !== undefined)
            ? <a href={`/profile/${authorId}/publications/${entityId}`}>{normalizeEntityName(entityName)}</a>
            : <a target="_blank" href={`https://en.wikipedia.org/wiki/${entityName}`}>{normalizeEntityName(entityName)}</a>
    }

    renderWikipediaPopup = () => {
        const {popupSummary} = this.state;

        const popupContent = <div
            dangerouslySetInnerHTML={{
            __html: popupSummary.extract_html
        }}/>,
            entityLink = this.renderEntityLink()

        return (<Popup
            position="right center"
            trigger={entityLink}
            content={popupContent}
            basic/>);
    }

    render = () => {
        const {popupSummary} = this.state

        return (popupSummary === null)
            ? this.renderEntityLink()
            : this.renderWikipediaPopup();

    }
}

export default EntityLink;