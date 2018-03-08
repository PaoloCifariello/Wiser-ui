import axios from 'axios'
import config from '../config.json'

function findExpertsByExpertise(expertiseArea) {
    return axios(`${config.serverAddress}/find_experts_by_field?q=${expertiseArea}`);
}

function findExpertsByName(expertName) {
    return axios(`${config.serverAddress}/find_experts_by_name?q=${expertName}`);
    
}

export default {
    findExpertsByExpertise : findExpertsByExpertise,
    findExpertsByName : findExpertsByName
};