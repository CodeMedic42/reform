import React, { Children, cloneElement, isValidElement, useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { isNil } from 'lodash-es';

type AccordionOrientation = 'horizontal' | 'vertical';
// 'single'     — only one frame expanded at a time (classic accordion).
// 'multiple'   — any number of frames can be expanded, no resizing.
// 'adjustable' — like 'multiple' plus draggable dividers between adjacent expanded frames.
type AccordionMode = 'single' | 'multiple' | 'adjustable';

interface AccordionProps {
    orientation?: AccordionOrientation;
    mode?: AccordionMode;
    defaultExpanded?: number | number[];
    // Fires whenever the set of expanded frames changes. Receives indices sorted ascending.
    onChange?: (expanded: number[]) => void;
    // Fires continuously while a divider is being dragged. Receives current flex-grow weights.
    onResize?: (weights: number[]) => void;
    // Fires once when a drag completes. Receives the committed weights.
    onResizeEnd?: (weights: number[]) => void;
    className?: string;
    children?: React.ReactNode;
}

// Snapshot taken at drag start and kept in a ref so the live pointermove handler can read it
// without going through React state (which would lag a frame behind and feel sluggish).
interface DragState {
    startCoord: number;        // Pointer position (clientX or clientY) at pointerdown.
    startWeights: number[];    // Flex-grow values for every frame at drag start.
    containerSize: number;     // Container width or height at drag start, for px↔weight conversion.
    leftIndex: number;         // Index of the expanded frame on the "before" side of the divider.
    rightIndex: number;        // Index of the expanded frame on the "after" side of the divider.
    panelNodes: HTMLElement[]; // Live DOM refs so we can mutate flex-grow directly during drag.
    cleanup: () => void;       // Removes window listeners + restores body styles.
    engaged: boolean;          // True once movement exceeded DRAG_THRESHOLD; pre-engage moves are ignored.
}

// Pixels of pointer movement required before a drag is treated as a real resize.
// Prevents a tiny jitter on pointerdown from being interpreted as a drag.
const DRAG_THRESHOLD = 4;
// Hard floor on how small (in pixels) a panel can be squeezed during a drag.
const MIN_PANEL_SIZE = 50;

// Accepts the user-supplied `defaultExpanded` (which may be a single index, an array, or omitted)
// and produces the initial expanded-set. Drops out-of-range and non-integer indices, and in
// 'single' mode keeps only the first valid one so the initial state never violates the mode.
function normalizeDefault(
    defaultExpanded: number | number[] | undefined,
    mode: AccordionMode,
    frameCount: number,
): Set<number> {
    if (isNil(defaultExpanded)) {
        return new Set();
    }
    
    const arr = Array.isArray(defaultExpanded) ? defaultExpanded : [defaultExpanded];
    const valid = arr.filter((i) => Number.isInteger(i) && i >= 0 && i < frameCount);
    
    if (mode === 'single' && valid.length > 1) {
        return new Set([valid[0]]);
    }
    
    return new Set(valid);
}

// Walks backwards from `index` to find the nearest expanded frame before it. Used to identify
// the "left neighbor" for a resizer: a divider only exists between two adjacent EXPANDED frames,
// and any collapsed frames in between are skipped over.
function findPrevExpanded(expanded: Set<number>, index: number): number {
    for (let i = index - 1; i >= 0; i--) {
        if (expanded.has(i)) {
            return i;
        }
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

    // The outer accordion DOM node — needed to measure container size and to scope panel-node lookups.
    const containerRef = useRef<HTMLDivElement>(null);
    // Active drag snapshot. Lives in a ref (not state) because the pointermove handler runs at
    // pointer-event rate and must read/write the latest values synchronously without re-renders.
    const dragStateRef = useRef<DragState | null>(null);

    // Only React-element children become frames. Other node types (strings, fragments, null) are
    // filtered out so injected props don't get cloned onto something that can't accept them.
    const childArray = Children.toArray(children).filter(isValidElement);
    const frameCount = childArray.length;

    // Indices of currently-expanded frames. A Set lets toggle/lookup stay O(1) regardless of count.
    const [expanded, setExpanded] = useState<Set<number>>(
        () => normalizeDefault(defaultExpanded, mode, frameCount),
    );
    // Per-frame flex-grow weights (adjustable mode only). `null` means "no user customization yet —
    // let CSS apply its default 1-each distribution to expanded frames". Becomes an array once the
    // user drags, and gets reset back to null on toggle so collapse/expand redistributes evenly.
    const [weights, setWeights] = useState<number[] | null>(null);
    // True while a divider is actively being dragged. Drives the `dragging` className that disables
    // CSS transitions so panels don't lag behind the cursor.
    const [dragging, setDragging] = useState(false);
    // Derived-state trick: if the caller adds/removes children between renders, our stored weights
    // array becomes mis-indexed against the new frames. We track the count we last saw and discard
    // the weights array as a corrective render when it changes — cheaper than a useEffect+commit.
    const [prevCount, setPrevCount] = useState(frameCount);

    if (prevCount !== frameCount) {
        setPrevCount(frameCount);
        if (!isNil(weights)) {
            setWeights(null);
        }
    }

    // Mirror callback props into refs so the long-lived pointermove/pointerup handlers always read
    // the latest version without us having to tear them down and re-attach when the caller passes
    // a new function identity each render.
    const onChangeRef = useRef(onChange);
    const onResizeRef = useRef(onResize);
    const onResizeEndRef = useRef(onResizeEnd);
    useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
    useEffect(() => { onResizeRef.current = onResize; }, [onResize]);
    useEffect(() => { onResizeEndRef.current = onResizeEnd; }, [onResizeEnd]);

    // Safety net: if the component unmounts mid-drag, tear down window listeners and body styles
    // so we don't leak handlers or leave `cursor: row-resize` stuck on the document.
    useEffect(() => () => {
            const ds = dragStateRef.current;
            if (!isNil(ds)) {
                ds.cleanup();
                dragStateRef.current = null;
            }
        }, []);

    // Called by each frame's header click/keydown. Toggles that frame's expanded state, respects
    // mode rules ('single' closes whatever else was open), and notifies the caller.
    const handleToggle = useCallback((frameIndex: number) => {
        // We capture the sorted result inside the updater so we can pass it to onChange *after*
        // setExpanded — without having to recompute the set outside the updater.
        let nextSorted: number[] = [];

        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(frameIndex)) {
                next.delete(frameIndex);
            } else {
                if (mode === 'single') {
                    next.clear();
                }
                next.add(frameIndex);
            }
            nextSorted = Array.from(next).sort((a, b) => a - b);
            return next;
        });
        
        const cb = onChangeRef.current;
        
        if (!isNil(cb)) {
            cb(nextSorted);
        }
        
        if (mode === 'adjustable') {
            // Opening or closing a frame changes which panels participate in the flex distribution,
            // so any previously-customized weights array is stale. Reset to null so the next render
            // hands an even split back to CSS until the user drags again. The `isNil(w) ? w : null`
            // shape skips the state update when there's nothing to clear, avoiding a no-op re-render.
            setWeights((w) => (isNil(w) ? w : null));
        }
    }, [mode]);

    // Invoked when the user presses pointer down on a resizer. Resolves the left-neighbor frame
    // from current expanded state, sets up the drag state, attaches window-level pointer listeners,
    // and returns. The actual resize math runs in `onMove`; commit runs in `endDrag`.
    const handleResizeStart = useCallback((e: React.PointerEvent<HTMLDivElement>, rightIndex: number) => {
        // Bail-out guards — each one prevents a different malformed-call scenario:
        // Resizing only applies in adjustable mode.
        if (mode !== 'adjustable') {
            return;
        }

        // Only the primary pointer button starts a drag.
        if (e.button !== 0) {
            return;
        }

        // A drag is already in progress.
        if (!isNil(dragStateRef.current)) {
            return;
        }

        // The right-side frame must itself be expanded, and a preceding expanded neighbor must
        // exist for there to be anything to redistribute against. CSS should prevent this from
        // firing on a resizer that doesn't qualify, but keep the guard for safety.
        if (!expanded.has(rightIndex)) {
            return;
        }

        const leftIndex = findPrevExpanded(expanded, rightIndex);

        if (leftIndex === -1) {
            return;
        }

        const container = containerRef.current;

        if (isNil(container)) {
            return;
        }

        // `:scope >` restricts to *direct* children so nested accordions inside a panel can't
        // confuse our panel list.
        const panelNodes = Array.from(
            container.querySelectorAll<HTMLElement>(':scope > .ra-accordion-frame'),
        );

        if (panelNodes.length < 2) {
            return;
        }

        const containerRect = container.getBoundingClientRect();
        const containerSize = orientation === 'horizontal' ? containerRect.width : containerRect.height;

        // Container is hidden (display:none / collapsed) — nothing to drag against.
        if (containerSize <= 0) {
            return;
        }

        // Take a measurement of every panel's rendered size. These pixel values become the seed
        // flex-grow weights the first time the user drags: this way the drag starts from whatever
        // the user is currently seeing, not from some abstract "1 each" default that would jump.
        const pixelSizes = panelNodes.map((n) => {
            const r = n.getBoundingClientRect();
            return orientation === 'horizontal' ? r.width : r.height;
        });

        const seedWeights = weights ?? pixelSizes;

        // Commit the seed to state on the very first drag so subsequent renders pin panels in place
        // instead of snapping back to the CSS-default 1-each distribution while the drag is in flight.
        if (isNil(weights)) {
            setWeights(seedWeights);
        }

        const startCoord = orientation === 'horizontal' ? e.clientX : e.clientY;
        // Defensive copy — startWeights is the immutable baseline used for delta arithmetic during
        // the drag; mutating it would make every subsequent delta compound on the previous one.

        const startWeights = [...seedWeights];

        const onMove = (ev: PointerEvent) => {
            const ds = dragStateRef.current;

            if (isNil(ds)) {
                return;
            }

            const currentCoord = orientation === 'horizontal' ? ev.clientX : ev.clientY;
            const deltaPx = currentCoord - ds.startCoord;

            // First-engage gate: until the pointer has moved beyond DRAG_THRESHOLD pixels we treat
            // the gesture as "press without intent to drag" so we don't fight click-vs-drag with
            // the OS. Once we pass the threshold we lock in body cursor + disable text selection
            // for the duration.
            if (!ds.engaged) {
                if (Math.abs(deltaPx) < DRAG_THRESHOLD) {
                    return;
                }

                ds.engaged = true;
                setDragging(true);
                
                document.body.style.userSelect = 'none';
                document.body.style.cursor = orientation === 'horizontal' ? 'e-resize' : 'n-resize';
            }

            // Translate pixels into flex-grow weight units. Because seedWeights were sourced from
            // pixel sizes summing roughly to containerSize, the ratio collapses to deltaPx ≈ deltaWeight
            // on the first drag — but the formula keeps working after weights have been customized.
            const totalWeight = ds.startWeights.reduce((a, b) => a + b, 0);
            const deltaWeight = (deltaPx / ds.containerSize) * totalWeight;
            const minWeight = (MIN_PANEL_SIZE / ds.containerSize) * totalWeight;

            // Zero-sum redistribution: whatever weight the left panel gains, the right panel loses.
            // pairSum is constant (their combined slice doesn't change) so we use it to recover the
            // partner's value when one side clamps to the minimum.
            const i = ds.leftIndex;
            const j = ds.rightIndex;
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

            // Write directly to the DOM rather than going through React state. Pointer events fire
            // at ~120Hz; a setState per frame would queue renders faster than React can flush them
            // and the resizer would feel sluggish. We reconcile to state once on release in endDrag.
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

        // Runs on pointerup / pointercancel / lostpointercapture / window blur. We listen for all of
        // these because any one of them means "the gesture is over" and missing any could leak a
        // half-completed drag (panels stuck to the cursor, body cursor stuck on row-resize).
        const endDrag = () => {
            const ds = dragStateRef.current;
            
            if (isNil(ds)) {
                return;
            }

            ds.cleanup();
            
            const wasEngaged = ds.engaged;
            
            // Read the final flex-grow back out of the DOM rather than re-doing the math, so the
            // committed state matches exactly what the user saw at the moment of release.
            const finalWeights = ds.panelNodes.map((n, idx) => {
                const fg = parseFloat(n.style.flexGrow || '');

                return Number.isFinite(fg) ? fg : ds.startWeights[idx];
            });

            dragStateRef.current = null;

            // Only commit state if the gesture actually became a real drag. A press-without-move
            // shouldn't flicker `dragging` true/false or overwrite weights with the seed values.
            if (wasEngaged) {
                setDragging(false);
                setWeights(finalWeights);

                const cb = onResizeEndRef.current;

                if (!isNil(cb)) {
                    cb(finalWeights);
                }
            }
        };

        // Detaches everything endDrag/onMove rely on. Stored on the drag state so the unmount
        // safety-net effect can call it without needing closure access.
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

        // Capture the pointer to the resizer element so move/up events keep targeting it even if
        // the cursor leaves the resizer's bounds (which it will — that's the whole point of dragging).
        try {
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        } catch {
            // setPointerCapture can throw if the pointer is no longer active — listeners still work.
        }

        // Listen on `window` rather than the resizer element: pointer capture makes this mostly
        // redundant, but window listeners are the reliable fallback when capture is lost (e.g. the
        // user alt-tabs away mid-drag, or another element steals capture).
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', endDrag);
        window.addEventListener('pointercancel', endDrag);
        window.addEventListener('lostpointercapture', endDrag);
        window.addEventListener('blur', endDrag);
    }, [orientation, expanded, mode, weights]);

    // We don't render the children directly — we cloneElement each one to inject the props it needs
    // to behave as part of this accordion (expanded state, toggle handler, optional drag handler).
    // This keeps `<AccordionFrame>` usable without the caller having to wire any of that themselves.
    const content = childArray.map((child, index) => {
        const isExpanded = expanded.has(index);
        
        const injected: Record<string, unknown> = {
            expanded: isExpanded,
            onToggle: () => handleToggle(index),
        };

        if (mode === 'adjustable') {
            // Apply the customized weight only when (a) the user has dragged at least once, and
            // (b) this specific frame is expanded. Collapsed frames keep CSS-default flex-grow:0
            // so they shrink to header size regardless of what's stored in the weights array.
            if (!isNil(weights) && isExpanded) {
                injected.flexGrow = weights[index];
            }

            // Every expanded frame gets the handler. CSS (`.expanded ~ .expanded > .resizer`) decides
            // which resizer divs are actually visible/interactive, and handleResizeStart resolves the
            // left neighbor at click time from current state.
            if (isExpanded) {
                injected.onResizeStart = (e: React.PointerEvent<HTMLDivElement>) => handleResizeStart(e, index);
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
