import React, {Component} from 'react';
import {Popup} from 'semantic-ui-react';

import {normalizeEntityName} from "../reusable/Entity"
import wiki_api from '../../api/wiki_api';
import PropTypes from 'prop-types';
class EntityLink extends Component {
    static defaultProps = {
        popup: true,
        link: true
    }

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

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.entityId !== this.props.entityId) {
            this.setState({popupSummary: null});
        }
    }

    entityIsChanged = (nextEntityId) => {
        const {entityId} = this.props;

        return entityId !== nextEntityId;
    }

    summaryNeedsReload = () => {
        const {entityName} = this.props;
        const {popupSummary} = this.state;

        if (popupSummary && popupSummary.titles.canonical === entityName) {
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
        const {authorId, entityId, entityName, link} = this.props;

        if (!link) 
            return (
                <span>{normalizeEntityName(entityName)}</span>
            );
        else if (authorId !== undefined) {
            return <a href={`/profile/${authorId}/publications/${entityId}`}>{normalizeEntityName(entityName)}</a>
        } else 
            return <a target="_blank" href={`https://en.wikipedia.org/wiki/${entityName}`}>{normalizeEntityName(entityName)}</a>
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
        const {popup} = this.props;
        const {popupSummary} = this.state

        return (popupSummary === null || popup === false)
            ? this.renderEntityLink()
            : this.renderWikipediaPopup();

    }
}

EntityLink.propTypes = {
    entityId: PropTypes.number.isRequired,
    entityName: PropTypes.string.isRequired,
    authorId: PropTypes.string,
    showPopup: PropTypes.bool,
    link: PropTypes.bool
}

export default EntityLink;