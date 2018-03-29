import React from 'react';

const normalizeEntityName = (entityName) => entityName.replace(/_/g, " ")

const renderEntityLink = (entityName) => {
    return <a target="_blank" href={`https://en.wikipedia.org/wiki/${entityName}`}>{normalizeEntityName(entityName)}</a>
}

const computeEntityReciaf = (entity) => entity["document_count"] * Math.sqrt(entity["pr_score"]) * entity["iaf"]

export {normalizeEntityName, renderEntityLink, computeEntityReciaf};
