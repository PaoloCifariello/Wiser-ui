import axios from 'axios'


async function getSummary(entityName) {
    return axios.request(`https://en.wikipedia.org/api/rest_v1/page/summary/${entityName}`).then((res) => Promise.resolve(res.data));
}

export default {
    getSummary: getSummary
};