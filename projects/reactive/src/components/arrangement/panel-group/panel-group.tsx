import React, { Children, cloneElement, isValidElement, useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { isNil } from 'lodash-es';
import PanelDivider from './panel-divider.js';

type PanelGroupDirection = 'horizontal' | 'vertical';

interface PanelGroupProps {
    direction?: PanelGroupDirection;
    onResize?: (weights: number[]) => void;
    onResizeEnd?: (weights: number[]) => void;
    className?: string;
    children?: React.ReactNode;
}

interface DragState {
    startCoord: number;
    startWeights: number[];
    containerSize: number;
    dividerIndex: number;
    panelNodes: HTMLElement[];
    cleanup: () => void;
}

const MIN_PANEL_SIZE = 50;

function PanelGroup(props: PanelGroupProps) {
    const {
        className,
        children,
        direction = 'horizontal',
        onResize,
        onResizeEnd,
        ...rest
    } = props;

    const containerRef = useRef<HTMLDivElement>(null);
    const dragStateRef = useRef<DragState | null>(null);

    const childArray = Children.toArray(children).filter(isValidElement);
    const panelCount = childArray.length;

    const [weights, setWeights] = useState<number[] | null>(null);
    const [prevCount, setPrevCount] = useState(panelCount);

    // Reset weights if the number of panels changes — stored sizes are no longer valid.
    if (prevCount !== panelCount) {
        setPrevCount(panelCount);
        if (!isNil(weights)) {
            setWeights(null);
        }
    }

    const onResizeRef = useRef(onResize);
    const onResizeEndRef = useRef(onResizeEnd);
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

    const handleResizeStart = useCallback((e: React.PointerEvent<HTMLDivElement>, dividerIndex: number) => {
        if (e.button !== 0) return;
        if (!isNil(dragStateRef.current)) return;
        const container = containerRef.current;
        if (isNil(container)) return;

        const panelNodes = Array.from(
            container.querySelectorAll<HTMLElement>(':scope > .ra-panel')
        );
        if (panelNodes.length < 2) return;
        if (dividerIndex < 0 || dividerIndex >= panelNodes.length - 1) return;

        const containerRect = container.getBoundingClientRect();
        const containerSize = direction === 'horizontal' ? containerRect.width : containerRect.height;
        if (containerSize <= 0) return;

        // Pixel sizes are valid initial weights — only their ratios matter.
        const pixelSizes = panelNodes.map((n) => {
            const r = n.getBoundingClientRect();
            return direction === 'horizontal' ? r.width : r.height;
        });
        const seedWeights = weights ?? pixelSizes;

        if (isNil(weights)) {
            setWeights(seedWeights);
        }

        const startCoord = direction === 'horizontal' ? e.clientX : e.clientY;
        const startWeights = [...seedWeights];

        const handleMove = (ev: PointerEvent) => {
            const ds = dragStateRef.current;
            if (isNil(ds)) return;
            const currentCoord = direction === 'horizontal' ? ev.clientX : ev.clientY;
            const deltaPx = currentCoord - ds.startCoord;

            const totalWeight = ds.startWeights.reduce((a, b) => a + b, 0);
            const deltaWeight = (deltaPx / ds.containerSize) * totalWeight;
            const minWeight = (MIN_PANEL_SIZE / ds.containerSize) * totalWeight;

            const i = ds.dividerIndex;
            const j = i + 1;
            const pairSum = ds.startWeights[i] + ds.startWeights[j];
            let leftW = ds.startWeights[i] + deltaWeight;
            let rightW = ds.startWeights[j] - deltaWeight;

            if (leftW < minWeight) {
                leftW = minWeight;
                rightW = pairSum - minWeight;
            }
            if (rightW < minWeight) {
                rightW = minWeight;
                leftW = pairSum - minWeight;
            }

            ds.panelNodes[i].style.flexGrow = String(leftW);
            ds.panelNodes[j].style.flexGrow = String(rightW);

            const callback = onResizeRef.current;
            if (!isNil(callback)) {
                const current = [...ds.startWeights];
                current[i] = leftW;
                current[j] = rightW;
                callback(current);
            }
        };

        const endDrag = () => {
            const ds = dragStateRef.current;
            if (isNil(ds)) return;
            ds.cleanup();
            const finalWeights = ds.panelNodes.map((n) => parseFloat(n.style.flexGrow || '1'));
            dragStateRef.current = null;
            setWeights(finalWeights);
            const callback = onResizeEndRef.current;
            if (!isNil(callback)) {
                callback(finalWeights);
            }
        };

        const cleanup = () => {
            window.removeEventListener('pointermove', handleMove);
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
            dividerIndex,
            panelNodes,
            cleanup,
        };

        document.body.style.userSelect = 'none';
        document.body.style.cursor = direction === 'horizontal' ? 'e-resize' : 'n-resize';

        try {
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        } catch {
            // setPointerCapture can throw if the pointer is no longer active — drag still works via window listeners
        }

        window.addEventListener('pointermove', handleMove);
        window.addEventListener('pointerup', endDrag);
        window.addEventListener('pointercancel', endDrag);
        window.addEventListener('lostpointercapture', endDrag);
        window.addEventListener('blur', endDrag);

        e.preventDefault();
    }, [direction, weights]);

    const content: React.ReactNode[] = [];
    childArray.forEach((child, index) => {
        const panelChild = !isNil(weights)
            ? cloneElement(child as React.ReactElement<any>, { _flexGrow: weights[index] })
            : child;
        content.push(panelChild);
        if (index < childArray.length - 1) {
            content.push(
                <PanelDivider
                    key={`divider-${index}`}
                    direction={direction}
                    dividerIndex={index}
                    onResizeStart={handleResizeStart}
                />,
            );
        }
    });

    return (
        <div
            ref={containerRef}
            className={classNames('ra-panel-group', `ra-panel-group', ${direction}`, className)}
            {...rest}
        >
            {content}
        </div>
    );
}

export default PanelGroup;
