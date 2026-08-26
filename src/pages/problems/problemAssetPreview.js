import {
    getProblemDraftAssetPreview,
    getStoredProblemAssetUrl,
} from '../../api/problems/problemAssetApi.js';

const DRAFT_ASSET_FALLBACK_CODES = new Set([
    'PROBLEM_DRAFT_PREVIEW_NOT_READY',
    'PROBLEM_DRAFT_NOT_FOUND',
]);

const resolveStoredAsset = async ({ asset, sourceQuestionId, signal }) => {
    if (sourceQuestionId == null) return asset;

    try {
        const storedAsset = await getStoredProblemAssetUrl({
            questionId: sourceQuestionId,
            assetKey: asset.assetKey,
            signal,
        });

        return {
            ...asset,
            url: storedAsset.url ?? asset.url,
        };
    } catch (error) {
        if (signal?.aborted) throw error;
        return asset;
    }
};

const resolveAssetPreview = async ({
    asset,
    sessionId,
    versionId,
    sourceQuestionId,
    signal,
}) => {
    if (asset.url || asset.dataUrl) {
        return {
            ...asset,
            url: asset.url ?? asset.dataUrl,
        };
    }

    if (!asset.assetKey || sessionId == null || versionId == null) return asset;

    try {
        const preview = await getProblemDraftAssetPreview({
            sessionId,
            versionId,
            assetKey: asset.assetKey,
            signal,
        });

        return {
            ...asset,
            widthPx: preview.widthPx ?? asset.widthPx,
            heightPx: preview.heightPx ?? asset.heightPx,
            url: preview.dataUrl ?? asset.url,
        };
    } catch (error) {
        if (signal?.aborted) throw error;
        if (DRAFT_ASSET_FALLBACK_CODES.has(error.code)) {
            return resolveStoredAsset({ asset, sourceQuestionId, signal });
        }
        return asset;
    }
};

export const hydrateProblemAssetPreviews = async ({ problem, signal }) => {
    const assets = problem?.assets ?? [];

    if (!assets.length) return problem;

    const hydratedAssets = await Promise.all(assets.map((asset) => resolveAssetPreview({
        asset,
        sessionId: problem.sessionId,
        versionId: problem.versionId,
        sourceQuestionId: problem.sourceQuestionId,
        signal,
    })));
    const assetIndex = new Map(hydratedAssets.map((asset) => [asset.assetKey, asset]));

    return {
        ...problem,
        assets: hydratedAssets,
        contentBlocks: problem.contentBlocks.map((block) => ({
            ...block,
            asset: block.assetRef ? assetIndex.get(block.assetRef) ?? null : block.asset,
        })),
    };
};
