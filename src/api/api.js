import axios from 'axios'
import config from '../config.json'

function findExpertsByExpertise(expertiseArea) {
    return axios.request(`${config.serverAddress}/find_experts_by_field?q=${expertiseArea}`);
}

function findExpertsByName(expertName) {
    return axios.request(`${config.serverAddress}/find_experts_by_name?q=${expertName}`);

}

function getAuthorProfile(authorId) {
    return axios.request(`${config.serverAddress}/get_author_profile?id=${authorId}`);
}

function getAuthorTopics(authorId) {
    return axios.request(`${config.serverAddress}/get_author_topics`, {
        params: {
            id: authorId
        }
    });
}

function getAuthorPublications(authorId, filterTopics) {
    return axios.request(`${config.serverAddress}/get_author_publications`, {
        params: {
            id: authorId
        }
    });
}

function getAuthorPublication(publicationId) {
    return axios.request(`${config.serverAddress}/get_author_publication`, {
        params: {
            pid: publicationId
        }
    });
}

function getStatistics() {
    return axios.request(`${config.serverAddress}/get_statistics`);
}

export default {
    findExpertsByExpertise : findExpertsByExpertise,
    findExpertsByName : findExpertsByName,
    getAuthorProfile : getAuthorProfile,
    getAuthorTopics : getAuthorTopics,
    getAuthorPublications : getAuthorPublications,
    getAuthorPublication : getAuthorPublication,
    getStatistics : getStatistics
};