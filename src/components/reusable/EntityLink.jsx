import React, {Component} from 'react';
import {Popup} from 'semantic-ui-react';

import {normalizeEntityName} from "../reusable/Entity"
import wiki_api from '../../api/wiki_api';
import PropTypes from 'prop-types';
class EntityLink extends Component {

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

    entityIsChanged = (nextEntityId) => {
        const {entityId} = this.props;

        return entityId !== nextEntityId;
    }

    summaryNeedsReload = (nextPopupSummary) => {
        const {entityId} = this.props;
        const {popupSummary} = this.state;

        if (popupSummary && popupSummary.pageid === entityId) {
            return false;
        } else {
            return true;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        const {popupSummary} = nextState;

        // we need to update the component if entityId is changed
        if (this.entityIsChanged(nextProps.entityId)) {
            return true;
        }

        // we need to update the component if the actual popupSummary is not for the
        // actual entity
        if (this.summaryNeedsReload(popupSummary)) {
            return true;
        }

        return false;
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

EntityLink.propTypes = {
    entityId: PropTypes.number.isRequired,
    entityName: PropTypes.string.isRequired,
    authorId: PropTypes.string
}

export default EntityLink;