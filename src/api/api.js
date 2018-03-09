import axios from 'axios'
import config from '../config.json'

function findExpertsByExpertise(expertiseArea) {
    return axios(`${config.serverAddress}/find_experts_by_field?q=${expertiseArea}`);
}

function findExpertsByName(expertName) {
    return axios(`${config.serverAddress}/find_experts_by_name?q=${expertName}`);

}

function getAuthorProfile(authorId) {
    return axios(`${config.serverAddress}/get_author_profile?id=${authorId}`);
}

function getAuthorTopics(authorId) {
    return axios(`${config.serverAddress}/get_author_topics?id=${authorId}`);
}

function getAuthorPublications(authorId) {
    return axios(`${config.serverAddress}/get_author_publications?id=${authorId}`);
}

export default {
    findExpertsByExpertise : findExpertsByExpertise,
    findExpertsByName : findExpertsByName,
    getAuthorProfile : getAuthorProfile,
    getAuthorTopics : getAuthorTopics,
    getAuthorPublications : getAuthorPublications
};