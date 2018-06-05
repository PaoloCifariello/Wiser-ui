import axios from 'axios'
import config from '../config.json'

const API_STATUS = Object.freeze({
    OK: 0,
    ERROR: 1
});

const api = (httpPromise) => httpPromise.then((res) => res.data.status === API_STATUS.OK ?
    Promise.resolve(res.data.content) :
    Promise.reject(res.data.content));

async function findExpertsByExpertise(expertiseArea) {
    return api(axios.request(`${config.serverAddress}/find_experts_by_field?q=${expertiseArea}`));
}

async function findExpertsByName(expertName) {
    return api(axios.request(`${config.serverAddress}/find_experts_by_name?q=${expertName}`));

}

async function getAuthorProfile(authorId) {
    return api(axios.request(`${config.serverAddress}/get_author_profile`, {
        params: {
            id: authorId
        }
    }));
}

async function getAuthorTopics(authorId) {
    return api(axios.request(`${config.serverAddress}/get_author_topics`, {
        params: {
            id: authorId
        }
    }));
}

async function getAuthorTopicsForSurvey(authorId) {
    return api(axios.request(`${config.serverAddress}/get_author_topics_survey`, {
        params: {
            id: authorId
        }
    }));
}

async function getAuthorPublications(authorId, filterTopics) {
    return api(axios.request(`${config.serverAddress}/get_author_publications`, {
        params: {
            id: authorId
        }
    }));
}

async function getAuthorPublication(publicationId) {
    return api(axios.request(`${config.serverAddress}/get_author_publication`, {
        params: {
            pid: publicationId
        }
    }));
}

async function getAuthorTopicsMatrix(authorId) {
    return api(axios.request(`${config.serverAddress}/get_author_topics_matrix`, {
        params: {
            aid: authorId
        }
    }));
}

async function getStatistics() {
    return api(axios.request(`${config.serverAddress}/get_statistics`));
}

async function getAuthorAreas(authorId, scoreThreshold) {
    return api(axios.request(`${config.serverAddress}/get_clusters`, {
        params: {
            aid: authorId,
            scoreThreshold: scoreThreshold
        }
    }));
}

async function submitSurvey(authorId, surveyRates) {
    // return api(axios.post(`${config.serverAddress}/submit_survey`, surveyRates));
    return api(axios.request(`${config.serverAddress}/submit_survey`, {
        params: {
            id: authorId
        },
        method: "post",
        data: surveyRates
    }));
}

export default {
    findExpertsByExpertise: findExpertsByExpertise,
    findExpertsByName: findExpertsByName,
    getAuthorProfile: getAuthorProfile,
    getAuthorTopics: getAuthorTopics,
    getAuthorTopicsForSurvey: getAuthorTopicsForSurvey,
    getAuthorPublications: getAuthorPublications,
    getAuthorPublication: getAuthorPublication,
    getAuthorTopicsMatrix: getAuthorTopicsMatrix,
    getStatistics: getStatistics,
    getAuthorAreas: getAuthorAreas,
    submitSurvey: submitSurvey
};