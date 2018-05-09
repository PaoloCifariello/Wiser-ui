import React from 'react';
import {Popup} from 'semantic-ui-react'

const normalizeEntityName = (entityName) => entityName.replace(/_/g, " ")
const computeEntityReciaf = (entity) => entity["document_count"] * Math.sqrt(entity["pr_score"]) * entity["iaf"]

export {normalizeEntityName, computeEntityReciaf};
