import React from 'react';

const normalizeEntityName = (entityName) => entityName.replace(/_/g, " ")

const renderWikiEntityLink = (entityName) => {
    return <a target="_blank" href={`https://en.wikipedia.org/wiki/${entityName}`}>{normalizeEntityName(entityName)}</a>
}

const renderAuthorEntityLink = (authorId, entityId, entityName) => {
    // return <a target="_blank" href={`https://en.wikipedia.org/wiki/${entityName}`}>{normalizeEntityName(entityName)}</a>
    return <a href={`/profile/${authorId}/publications/${entityId}`}>{normalizeEntityName(entityName)}</a>
}

const computeEntityReciaf = (entity) => entity["document_count"] * Math.sqrt(entity["pr_score"]) * entity["iaf"]

export {normalizeEntityName, renderWikiEntityLink, renderAuthorEntityLink, computeEntityReciaf};
