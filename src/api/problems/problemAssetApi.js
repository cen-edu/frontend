import httpClient from '../httpClient.js';

export const getProblemDraftAssetPreview = ({
    sessionId,
    versionId,
    assetKey,
    signal,
}) => (
    httpClient.get(
        `/teacher/problems/authoring-sessions/${sessionId}/versions/${versionId}/assets/${encodeURIComponent(assetKey)}/preview`,
        { signal },
    )
);

export const getStoredProblemAssetUrl = ({ questionId, assetKey, signal }) => (
    httpClient.get(
        `/images/problems/${questionId}/assets/${encodeURIComponent(assetKey)}`,
        { signal },
    )
);
