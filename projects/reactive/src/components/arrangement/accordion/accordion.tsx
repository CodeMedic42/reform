import React, { Children, cloneElement, isValidElement, useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { isNil } from 'lodash-es';

type AccordionOrientation = 'horizontal' | 'vertical';
type AccordionMode = 'single' | 'multiple' | 'adjustable';

interface AccordionProps {
    orientation?: AccordionOrientation;
    mode?: AccordionMode;
    defaultExpanded?: number | number[];
    onChange?: (expanded: number[]) => void;
    onResize?: (weights: number[]) => void;
    onResizeEnd?: (weights: number[]) => void;
    className?: string;
    children?: React.ReactNode;
}

interface DragState {
    startCoord: number;
    startWeights: number[];
    containerSize: number;
    leftIndex: number;
    rightIndex: number;
    panelNodes: HTMLElement[];
    cleanup: () => void;
    engaged: boolean;
}

const DRAG_THRESHOLD = 4;
const MIN_PANEL_SIZE = 50;

function normalizeDefault(
    defaultExpanded: number | number[] | undefined,
    mode: AccordionMode,
    frameCount: number,
): Set<number> {
    if (isNil(defaultExpanded)) return new Set();
    const arr = Array.isArray(defaultExpanded) ? defaultExpanded : [defaultExpanded];
    const valid = arr.filter((i) => Number.isInteger(i) && i >= 0 && i < frameCount);
    if (mode === 'single' && valid.length > 1) return new Set([valid[0]]);
    return new Set(valid);
}

function findPrevExpanded(expanded: Set<number>, index: number): number {
    for (let i = index - 1; i >= 0; i--) {
        if (expanded.has(i)) return i;
    }
    return -1;
}

function Accordion(props: AccordionProps) {
    const {
        className,
        children,
        orientation = 'vertical',
        mode = 'single',
        defaultExpanded,
        onChange,
        onResize,
        onResizeEnd,
        ...rest
    } = props;

    const containerRef = useRef<HTMLDivElement>(null);
    const dragStateRef = useRef<DragState | null>(null);
    const draggedRef = useRef(false);

    const childArray = Children.toArray(children).filter(isValidElement);
    const frameCount = childArray.length;

    const [expanded, setExpanded] = useState<Set<number>>(
        () => normalizeDefault(defaultExpanded, mode, frameCount),
    );
    const [weights, setWeights] = useState<number[] | null>(null);
    const [dragging, setDragging] = useState(false);
    const [prevCount, setPrevCount] = useState(frameCount);

    if (prevCount !== frameCount) {
        setPrevCount(frameCount);
        if (!isNil(weights)) setWeights(null);
    }

    const onChangeRef = useRef(onChange);
    const onResizeRef = useRef(onResize);
    const onResizeEndRef = useRef(onResizeEnd);
    useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
    useEffect(() => { onResizeRef.current = onResize; }, [onResize]);
    useEffect(() => { onResizeEndRef.current = onResizeEnd; }, [onResizeEnd]);

    useEffect(() => {
        return () => {
            const ds = dragStateRef.current;
            if (!isNil(ds)) {
                ds.cleanup();
                dragStateRef.current = null;
            }
        };
    }, []);

    const handleToggle = useCallback((frameIndex: number) => {
        if (draggedRef.current) {
            draggedRef.current = false;
            return;
        }
        let nextSorted: number[] = [];
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(frameIndex)) {
                next.delete(frameIndex);
            } else {
                if (mode === 'single') next.clear();
                next.add(frameIndex);
            }
            nextSorted = Array.from(next).sort((a, b) => a - b);
            return next;
        });
        const cb = onChangeRef.current;
        if (!isNil(cb)) cb(nextSorted);
        if (mode === 'adjustable') {
            // Toggling open/closed invalidates the existing weight distribution.
            setWeights((w) => (isNil(w) ? w : null));
        }
    }, [mode]);

    const handleResizeStart = useCallback((e: React.PointerEvent<HTMLDivElement>, rightIndex: number, leftIndex: number) => {
        if (mode !== 'adjustable') return;
        if (e.button !== 0) return;
        if (!isNil(dragStateRef.current)) return;
        if (leftIndex < 0 || rightIndex <= leftIndex) return;
        if (!expanded.has(leftIndex) || !expanded.has(rightIndex)) return;

        const container = containerRef.current;
        if (isNil(container)) return;

        const panelNodes = Array.from(
            container.querySelectorAll<HTMLElement>(':scope > .ra-accordion-frame'),
        );
        if (panelNodes.length < 2) return;

        const containerRect = container.getBoundingClientRect();
        const containerSize = orientation === 'horizontal' ? containerRect.width : containerRect.height;
        if (containerSize <= 0) return;

        const pixelSizes = panelNodes.map((n) => {
            const r = n.getBoundingClientRect();
            return orientation === 'horizontal' ? r.width : r.height;
        });
        const seedWeights = weights ?? pixelSizes;
        if (isNil(weights)) setWeights(seedWeights);

        const startCoord = orientation === 'horizontal' ? e.clientX : e.clientY;
        const startWeights = [...seedWeights];

        const onMove = (ev: PointerEvent) => {
            const ds = dragStateRef.current;
            if (isNil(ds)) return;
            const currentCoord = orientation === 'horizontal' ? ev.clientX : ev.clientY;
            const deltaPx = currentCoord - ds.startCoord;

            if (!ds.engaged) {
                if (Math.abs(deltaPx) < DRAG_THRESHOLD) return;
                ds.engaged = true;
                draggedRef.current = true;
                setDragging(true);
                document.body.style.userSelect = 'none';
                document.body.style.cursor = orientation === 'horizontal' ? 'e-resize' : 'n-resize';
            }

            const totalWeight = ds.startWeights.reduce((a, b) => a + b, 0);
            const deltaWeight = (deltaPx / ds.containerSize) * totalWeight;
            const minWeight = (MIN_PANEL_SIZE / ds.containerSize) * totalWeight;

            const i = ds.leftIndex;
            const j = ds.rightIndex;
            const pairSum = ds.startWeights[i] + ds.startWeights[j];
            let leftW = ds.startWeights[i] + deltaWeight;
            let rightW = ds.startWeights[j] - deltaWeight;
            if (leftW < minWeight) { leftW = minWeight; rightW = pairSum - minWeight; }
            if (rightW < minWeight) { rightW = minWeight; leftW = pairSum - minWeight; }

            ds.panelNodes[i].style.flexGrow = String(leftW);
            ds.panelNodes[j].style.flexGrow = String(rightW);

            const cb = onResizeRef.current;
            if (!isNil(cb)) {
                const current = [...ds.startWeights];
                current[i] = leftW;
                current[j] = rightW;
                cb(current);
            }
        };

        const endDrag = () => {
            const ds = dragStateRef.current;
            if (isNil(ds)) return;
            ds.cleanup();
            const wasEngaged = ds.engaged;
            const finalWeights = ds.panelNodes.map((n, idx) => {
                const fg = parseFloat(n.style.flexGrow || '');
                return Number.isFinite(fg) ? fg : ds.startWeights[idx];
            });
            dragStateRef.current = null;
            if (wasEngaged) {
                setDragging(false);
                setWeights(finalWeights);
                const cb = onResizeEndRef.current;
                if (!isNil(cb)) cb(finalWeights);
            }
        };

        const cleanup = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', endDrag);
            window.removeEventListener('pointercancel', endDrag);
            window.removeEventListener('lostpointercapture', endDrag);
            window.removeEventListener('blur', endDrag);
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };

        dragStateRef.current = {
            startCoord,
            startWeights,
            containerSize,
            leftIndex,
            rightIndex,
            panelNodes,
            cleanup,
            engaged: false,
        };

        try {
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        } catch {
            // setPointerCapture can throw if the pointer is no longer active — listeners still work.
        }

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', endDrag);
        window.addEventListener('pointercancel', endDrag);
        window.addEventListener('lostpointercapture', endDrag);
        window.addEventListener('blur', endDrag);
    }, [orientation, expanded, mode, weights]);

    const content = childArray.map((child, index) => {
        const isExpanded = expanded.has(index);
        const injected: Record<string, unknown> = {
            _expanded: isExpanded,
            _orientation: orientation,
            _onToggle: () => handleToggle(index),
        };
        if (mode === 'adjustable') {
            if (!isNil(weights) && isExpanded) {
                injected._flexGrow = weights[index];
            }
            if (isExpanded) {
                const leftIndex = findPrevExpanded(expanded, index);
                if (leftIndex !== -1) {
                    injected._onResizeStart = (e: React.PointerEvent<HTMLDivElement>) => handleResizeStart(e, index, leftIndex);
                }
            }
        }
        return cloneElement(child as React.ReactElement<any>, injected);
    });

    return (
        <div
            ref={containerRef}
            className={classNames(
                'ra-accordion',
                `orientation-${orientation}`,
                `mode-${mode}`,
                { dragging },
                className,
            )}
            {...rest}
        >
            {content}
        </div>
    );
}

export default Accordion;
