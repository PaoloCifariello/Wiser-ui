import React, {PureComponent} from 'react';

// import Slider from 'rc-slider';
import WiserTagCloud from '../reusable/WiserTagClouds';
import api from '../../api/api'

class AuthorTagcloud extends PureComponent {
    constructor(props) {
        super(props);
        const {authorInformation} = this.props;

        this.state = {
            authorYears: Object
                .keys(authorInformation.authorYears)
                .map((val) => parseInt(val, 10))
                .sort(),
            authorTopics: []
        }
    }

    componentDidMount = () => {
        const {authorId} = this.props.authorInformation;

        api
            .getAuthorTopics(authorId)
            .then(this.setAuthorTopicsState)
    }

    setAuthorTopicsState = (data) => this.setState({authorTopics: data.topics})

    render = () => {
        const {authorYears, authorTopics} = this.state;

        return <WiserTagCloud topics={authorTopics} years={authorYears}/>
    }

}

export default AuthorTagcloud;