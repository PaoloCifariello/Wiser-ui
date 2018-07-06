import stopEntitiesLink from "./stopentities.csv"
import csv from 'csvtojson'
import Axios from "axios";

var STOP_ENTITIES = [];

Axios.get(stopEntitiesLink).then((result) => {
    return csv().fromString(result.data)
}).then((data) => {
    STOP_ENTITIES = data.filter((row) => row.active === 'true');
})


class StopEntitiesList {

    static contains = (entity_id) => {
        return STOP_ENTITIES.find((entity) => parseInt(entity.entity_id, 10) === entity_id)
    }
}

export default StopEntitiesList;