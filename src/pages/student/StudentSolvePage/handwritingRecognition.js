import { ExportV2Type, HTTPClientV2 } from 'iink-ts';

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 360;
const ERASER_RADIUS = 14;

const toCanvasPoint = (point, width, height, time) => ({
    x: point.x * width,
    y: point.y * height,
    p: point.pressure || 0.5,
    t: time,
});

const distanceToSegment = (point, start, end) => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const segmentLengthSquared = deltaX ** 2 + deltaY ** 2;

    if (segmentLengthSquared === 0) {
        return Math.hypot(point.x - start.x, point.y - start.y);
    }

    const ratio = Math.max(0, Math.min(1, (
        ((point.x - start.x) * deltaX) + ((point.y - start.y) * deltaY)
    ) / segmentLengthSquared));
    const closestX = start.x + ratio * deltaX;
    const closestY = start.y + ratio * deltaY;

    return Math.hypot(point.x - closestX, point.y - closestY);
};

const splitStrokeByEraser = (stroke, eraserSegments) => {
    const parts = [];
    let currentPart = [];

    stroke.forEach((point) => {
        const erased = eraserSegments.some(([start, end]) => (
            distanceToSegment(point, start, end) <= ERASER_RADIUS
        ));

        if (erased) {
            if (currentPart.length >= 2) parts.push(currentPart);
            currentPart = [];
            return;
        }

        currentPart.push(point);
    });

    if (currentPart.length >= 2) parts.push(currentPart);
    return parts;
};

const getVisibleInkStrokes = (strokes, width, height) => {
    let timestamp = 0;
    let visibleStrokes = [];

    strokes.forEach((stroke) => {
        const points = stroke.points.map((point) => {
            timestamp += 16;
            return toCanvasPoint(point, width, height, timestamp);
        });

        if (stroke.tool !== 'eraser') {
            if (points.length >= 2) visibleStrokes.push(points);
            return;
        }

        const eraserSegments = points.slice(1).map((point, index) => [points[index], point]);
        visibleStrokes = visibleStrokes.flatMap((inkStroke) => (
            splitStrokeByEraser(inkStroke, eraserSegments)
        ));
    });

    return visibleStrokes.map((points, index) => ({
        id: `student-answer-${index}`,
        pointerType: 'pen',
        pointers: points,
    }));
};

const getCredentials = () => {
    const applicationKey = import.meta.env.VITE_MYSCRIPT_APPLICATION_KEY?.trim();
    const hmacKey = import.meta.env.VITE_MYSCRIPT_HMAC_KEY?.trim();

    if (!applicationKey || !hmacKey) {
        throw new Error('필기 인식 키가 설정되지 않았습니다.');
    }

    return { applicationKey, hmacKey };
};

export const recognizeHandwritingAsLatex = async (
    strokes,
    { width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT } = {},
) => {
    const visibleStrokes = getVisibleInkStrokes(strokes, width, height);
    if (visibleStrokes.length === 0) return null;

    const client = new HTTPClientV2({
        server: {
            scheme: 'https',
            host: 'cloud.myscript.com',
            ...getCredentials(),
        },
        recognition: {
            type: 'MATH',
            math: {
                mimeTypes: [ExportV2Type.LATEX],
            },
        },
    });
    const result = await client.send(visibleStrokes, [ExportV2Type.LATEX]);
    const rawLatex = result[ExportV2Type.LATEX]?.trim();

    if (!rawLatex) {
        throw new Error('필기 내용을 수식으로 인식하지 못했습니다. 다시 작성해 주세요.');
    }

    return rawLatex;
};
