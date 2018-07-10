import axios from 'axios'
import config from '../config.json'

const API_STATUS = Object.freeze({
    OK: 0,
    ERROR: 1
});

const api = (httpPromise) => httpPromise.then((res) => res.data.status === API_STATUS.OK ?
    Promise.resolve(res.data.content) :
    Promise.reject(res.data.content));

async function findExpertsByExpertise(expertiseArea, softSearch = false) {
    return api(axios.request(`${config.serverAddress}/find_experts_by_field`, {
        params: {
            q: expertiseArea,
            softSearch: softSearch
        }
    }));
}

async function findExpertsByName(expertName) {
    return api(axios.request(`${config.serverAddress}/find_experts_by_name?q=${expertName}`));

}

async function findDepartmentsByName(departmentName) {
    return api(axios.request(`${config.serverAddress}/find_departments_by_name?q=${departmentName}`));

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

async function getAuthorPublications(authorId) {
    return api(axios.request(`${config.serverAddress}/get_author_publications`, {
        params: {
            id: authorId
        }
    }));
}

async function getPublication(publicationId) {
    return api(axios.request(`${config.serverAddress}/get_publication`, {
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
    return api(axios.request(`${config.serverAddress}/get_author_clusters`, {
        params: {
            aid: authorId,
            scoreThreshold: scoreThreshold
        }
    }));
}

async function getDepartmentProfile(department) {
    return api(axios.request(`${config.serverAddress}/get_department_profile`, {
        params: {
            department: department
        }
    }));
}

async function getDepartmentTopics(department) {
    return api(axios.request(`${config.serverAddress}/get_department_topics`, {
        params: {
            department: department
        }
    }));
}

async function getDepartmentAreas(department_name, scoreThreshold) {
    return api(axios.request(`${config.serverAddress}/get_department_clusters`, {
        params: {
            department: department_name,
            scoreThreshold: scoreThreshold
        }
    }));
}

async function getDepartmentPublications(departmentName, year) {
    return api(axios.request(`${config.serverAddress}/get_department_publications`, {
        params: {
            depName: departmentName,
            year: year
        }
    }));
}

async function getAuthorProfiles(authorIds) {
    return api(axios.request(`${config.serverAddress}/get_author_profiles`, {
        method: "post",
        data: authorIds
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
    findDepartmentsByName: findDepartmentsByName,

    getAuthorProfile: getAuthorProfile,
    getAuthorTopics: getAuthorTopics,
    getAuthorAreas: getAuthorAreas,
    getAuthorPublications: getAuthorPublications,
    getAuthorTopicsMatrix: getAuthorTopicsMatrix,
    getAuthorTopicsForSurvey: getAuthorTopicsForSurvey,
    getAuthorProfiles: getAuthorProfiles,

    getDepartmentProfile: getDepartmentProfile,
    getDepartmentTopics: getDepartmentTopics,
    getDepartmentAreas: getDepartmentAreas,
    getDepartmentPublications: getDepartmentPublications,

    submitSurvey: submitSurvey,

    getPublication: getPublication,

    getStatistics: getStatistics
};