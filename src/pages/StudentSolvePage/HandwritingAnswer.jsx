import { useCallback, useEffect, useRef, useState } from 'react';
import { loadHandwriting, saveHandwriting } from './handwritingStorage';

const DRAW_COLOR = '#172033';

function HandwritingAnswer({ storageKey, onAnswerChange, onStrokesChange, compact = false, saveMode = 'auto' }) {
    const canvasRef = useRef(null);
    const strokesRef = useRef([]);
    const activeStrokeRef = useRef(null);
    const onAnswerChangeRef = useRef(onAnswerChange);
    const onStrokesChangeRef = useRef(onStrokesChange);
    const [strokes, setStrokes] = useState([]);
    const [tool, setTool] = useState('pen');
    const [saveState, setSaveState] = useState('saved');

    useEffect(() => {
        onAnswerChangeRef.current = onAnswerChange;
    }, [onAnswerChange]);

    useEffect(() => {
        onStrokesChangeRef.current = onStrokesChange;
    }, [onStrokesChange]);

    const drawStroke = useCallback((context, stroke, width, height) => {
        if (stroke.points.length < 2) return;
        context.save();
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = stroke.tool === 'eraser' ? 'rgba(0, 0, 0, 1)' : DRAW_COLOR;
        context.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';

        for (let index = 1; index < stroke.points.length; index += 1) {
            const previous = stroke.points[index - 1];
            const current = stroke.points[index];
            const pressure = current.pressure || 0.5;
            context.beginPath();
            context.lineWidth = stroke.tool === 'eraser' ? 22 : 2.2 + pressure * 2.6;
            context.moveTo(previous.x * width, previous.y * height);
            context.lineTo(current.x * width, current.y * height);
            context.stroke();
        }
        context.restore();
    }, []);

    const redraw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        const { width, height } = canvas.getBoundingClientRect();
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
        strokesRef.current.forEach((stroke) => drawStroke(context, stroke, width, height));
        context.restore();
    }, [drawStroke]);

    useEffect(() => {
        let active = true;
        setSaveState('loading');

        loadHandwriting(storageKey)
            .then((storedStrokes) => {
                if (!active) return;
                strokesRef.current = storedStrokes;
                setStrokes(storedStrokes);
                onAnswerChangeRef.current(storedStrokes.length > 0);
                onStrokesChangeRef.current?.(storedStrokes);
                setSaveState('saved');
            })
            .catch(() => {
                if (active) setSaveState('error');
            });

        return () => { active = false; };
    }, [storageKey]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;

        const resizeCanvas = () => {
            const ratio = window.devicePixelRatio || 1;
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = Math.round(width * ratio);
            canvas.height = Math.round(height * ratio);
            redraw();
        };

        const observer = new ResizeObserver(resizeCanvas);
        observer.observe(canvas);
        resizeCanvas();
        return () => observer.disconnect();
    }, [redraw]);

    useEffect(() => {
        if (saveMode !== 'auto' || saveState !== 'dirty') return undefined;
        const timeout = window.setTimeout(() => {
            saveHandwriting(storageKey, strokesRef.current)
                .then(() => setSaveState('saved'))
                .catch(() => setSaveState('error'));
        }, 350);
        return () => window.clearTimeout(timeout);
    }, [saveMode, saveState, storageKey, strokes]);

    useEffect(() => redraw(), [redraw, strokes]);

    const commitStrokes = (nextStrokes) => {
        strokesRef.current = nextStrokes;
        setStrokes(nextStrokes);
        setSaveState('dirty');
        onAnswerChange(nextStrokes.length > 0);
        onStrokesChangeRef.current?.(nextStrokes);
    };

    const getPoint = (event) => {
        const canvas = canvasRef.current;
        const bounds = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - bounds.left) / bounds.width,
            y: (event.clientY - bounds.top) / bounds.height,
            pressure: event.pressure || 0.5,
        };
    };

    const handlePointerDown = (event) => {
        if (event.pointerType === 'touch' && event.isPrimary === false) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        activeStrokeRef.current = { tool, points: [getPoint(event)] };
    };

    const handlePointerMove = (event) => {
        const activeStroke = activeStrokeRef.current;
        if (!activeStroke || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
        activeStroke.points.push(getPoint(event));
        redraw();
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const { width, height } = canvas.getBoundingClientRect();
        context.save();
        context.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
        drawStroke(context, activeStroke, width, height);
        context.restore();
    };

    const handlePointerUp = (event) => {
        if (!activeStrokeRef.current) return;
        event.currentTarget.releasePointerCapture(event.pointerId);
        commitStrokes([...strokesRef.current, activeStrokeRef.current]);
        activeStrokeRef.current = null;
    };

    return (
        <div className={`handwriting-answer${compact ? ' handwriting-answer--compact' : ''}`}>
            <div className="handwriting-answer__toolbar" aria-label="필기 도구">
                <div>
                    <button
                        type="button"
                        aria-pressed={tool === 'pen'}
                        onPointerDown={() => setTool('pen')}
                        onClick={() => setTool('pen')}
                    >
                        <i className="bi bi-pen" aria-hidden="true" /> 펜
                    </button>
                    <button
                        type="button"
                        aria-pressed={tool === 'eraser'}
                        onPointerDown={() => setTool('eraser')}
                        onClick={() => setTool('eraser')}
                    >
                        <i className="bi bi-eraser" aria-hidden="true" /> 지우개
                    </button>
                    <button type="button" disabled={strokes.length === 0} onClick={() => commitStrokes(strokesRef.current.slice(0, -1))}>
                        <i className="bi bi-arrow-counterclockwise" aria-hidden="true" /> 실행 취소
                    </button>
                    {!compact && <button type="button" disabled={strokes.length === 0} onClick={() => commitStrokes([])}>
                        <i className="bi bi-trash3" aria-hidden="true" /> 전체 지우기
                    </button>}
                </div>
            </div>
            <div className="handwriting-answer__paper">
                <canvas
                    ref={canvasRef}
                    aria-label="손글씨 답안 입력 영역"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                />
                {strokes.length === 0 && <p aria-hidden="true">{compact ? '이곳에 답을 쓰세요.' : '태블릿 펜이나 손가락으로 풀이와 답을 작성하세요.'}</p>}
            </div>
        </div>
    );
}

export default HandwritingAnswer;
