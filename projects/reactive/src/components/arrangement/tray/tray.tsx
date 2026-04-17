/* eslint-disable react/jsx-props-no-spreading */
import React, {
    Component,
    createContext,
    createRef,
} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { forEach, merge, isNil, noop } from 'lodash-es';
import shortId from 'shortid';

type DropPosition = 'top' | 'bottom' | 'left' | 'right';

interface TrayContextValue {
    renderIndex: number;
    onRegister: (component: Tray) => () => void;
}

const TrayContext = createContext<TrayContextValue>({
    renderIndex: 0,
    onRegister: () => noop,
});

const DEFAULT_DROP_POSITIONS: DropPosition[] = ['bottom', 'top', 'right', 'left'];

/*
sidePadding: The minimum amount of padding between the tray and the edge of the screen.
             This keeps the tray for touching the edge of the screen which looks bad.

windowHeight: The workable area where the tray can reside.

maxHeight(requestedMaxHeight): The maximum value, in px, the tray can grow vertically
before it stops growing.

minWidth(requestedMinWidth): The minimum value, in px, the tray can shrink horizontally
before it stops shrinking.
    - If the prop is set to "anchor", then the value is taken from the width of the anchor.

maxWidth(requestedMaxWidth): The maximum value, in px, the tray can grow horizontally
before it stops growing.
    - If the prop is set to "anchor", then the value is taken from the width of the anchor.

anchor: The element which the tray is positioned to. Can also affect the width.

tail: The little arrow which point back to the anchor
*/

// 4 represents the corner radius of the tray.
const cornerRadius = 4;

interface StylesMeta {
    top: string | null;
    left: string | null;
    bottom: string | null;
    right: string | null;
    zIndex: string | number | null;
    [key: string]: string | number | null | undefined;
}

const clearStylesMeta: StylesMeta = {
    top: null,
    left: null,
    bottom: null,
    right: null,
    zIndex: null,
};

function applyStyles(trayElement: HTMLElement, styles: Record<string, string | number | null | undefined>): void {
    forEach(styles, (styleValue, styleId) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const trayElementStyle = trayElement.style as any;

        if (trayElementStyle[styleId] !== styleValue) {
            // eslint-disable-next-line no-param-reassign
            trayElementStyle[styleId] = styleValue;
        }
    });
}

function clearStyles(trayElement: HTMLElement): void {
    applyStyles(trayElement, clearStylesMeta);

    trayElement.classList.remove('top');
    trayElement.classList.remove('bottom');
    trayElement.classList.remove('left');
    trayElement.classList.remove('right');
}

function buildPx(value: number | null | undefined): string | null {
    return !isNil(value) ? `${value}px` : null;
}

interface PositionValues {
    fromPosition: number;
    toPosition: number;
}

function determineAllowedHeight(windowHeight: number, positionValues: PositionValues): number {
    const {
        fromPosition,
        toPosition,
    } = positionValues;

    return windowHeight - fromPosition - toPosition;
}

interface RenderingParameters {
    anchorRect: DOMRect;
    trayRect: DOMRect;
    offset: { left: number; right: number; top: number; bottom: number };
    horizontallyCenter: boolean;
    dockRight: boolean;
    tailOffset: number;
    sidePadding: number;
    windowWidth: number;
    windowHeight: number;
    paddingValue: number;
    zIndex: number;
}

interface RenderResult {
    styles: Record<string, string | null>;
    location: string;
}

function attemptLevelTop(renderingParameters: RenderingParameters): Record<string, string | null> | null {
    const {
        anchorRect,
        windowHeight,
        sidePadding,
        offset: { top: topOffset },
        trayRect,
    } = renderingParameters;

    const topPosition = anchorRect.top + topOffset;

    if (topPosition < sidePadding) {
        return null;
    }

    const finalHeight = trayRect.height;

    const allowedMaxHeight = determineAllowedHeight(
        windowHeight,
        {
            fromPosition: topPosition,
            toPosition: sidePadding,
        },
    );

    if (allowedMaxHeight <= 0) {
        return null;
    }

    if (allowedMaxHeight < finalHeight) {
        return null;
    }

    const bottomPosition = topPosition + finalHeight + sidePadding;

    const hasRoom = bottomPosition <= windowHeight;

    if (!hasRoom) {
        return null;
    }

    return {
        top: buildPx(topPosition),
    };
}

function attemptLevelBottom(renderingParameters: RenderingParameters): Record<string, string | null> | null {
    const {
        anchorRect,
        windowHeight,
        sidePadding,
        offset: { bottom: bottomOffset },
        trayRect,
    } = renderingParameters;

    const bottomPosition = windowHeight - anchorRect.bottom + bottomOffset;

    if (bottomPosition < sidePadding) {
        return null;
    }

    const finalHeight = trayRect.height;

    const allowedMaxHeight = determineAllowedHeight(
        windowHeight,
        {
            fromPosition: sidePadding,
            toPosition: bottomPosition,
        },
    );

    if (allowedMaxHeight <= 0) {
        return null;
    }

    if (allowedMaxHeight < finalHeight) {
        return null;
    }

    const topPosition = anchorRect.bottom - finalHeight - sidePadding;

    const hasRoom = topPosition >= 0;

    if (!hasRoom) {
        return null;
    }

    return {
        bottom: buildPx(bottomPosition),
    };
}

function attemptLevelMiddle(renderingParameters: RenderingParameters): Record<string, string | null> {
    const {
        sidePadding, windowHeight, trayRect, anchorRect,
    } = renderingParameters;

    const finalHeight = trayRect.height;

    const styles: Record<string, string | null> = {};

    const hasRoom = sidePadding + sidePadding + finalHeight <= windowHeight;

    let mountTo = 'null';

    if (anchorRect.top < sidePadding) {
        mountTo = 'top';
    } else if (anchorRect.bottom > windowHeight - sidePadding) {
        mountTo = 'bottom';
    } else {
        const topDifference = anchorRect.top - sidePadding;
        const bottomDifference = windowHeight - anchorRect.bottom - sidePadding;

        mountTo = topDifference < bottomDifference ? 'top' : 'bottom';
    }

    if (mountTo === 'top') {
        styles.top = buildPx(sidePadding);

        if (!hasRoom) {
            styles.bottom = buildPx(sidePadding);
        }
    } else {
        styles.bottom = buildPx(sidePadding);

        if (!hasRoom) {
            styles.top = buildPx(sidePadding);
        }
    }

    return styles;
}

function attemptLevel(renderingParameters: RenderingParameters): RenderResult {
    let styles = attemptLevelTop(renderingParameters);

    if (!isNil(styles)) {
        return {
            styles,
            location: 'top',
        };
    }

    styles = attemptLevelBottom(renderingParameters);

    if (!isNil(styles)) {
        return {
            styles,
            location: 'bottom',
        };
    }

    return {
        styles: attemptLevelMiddle(renderingParameters),
        location: 'middle',
    };
}

function calcCenter(trayWidth: number, otherWidth: number): number {
    return (trayWidth - otherWidth) / 2;
}

function centerHorizontally(
    anchorRect: DOMRect,
    finalWidth: number,
    windowWidth: number,
    sidePadding: number,
): number {
    let offsetLeft = 0;
    let offsetRight = 0;

    const halfWidth = calcCenter(finalWidth, anchorRect.width);

    offsetLeft = anchorRect.left - halfWidth;
    offsetRight = anchorRect.right + halfWidth;

    let hasLeftRoom = offsetLeft >= sidePadding;

    if (hasLeftRoom) {
        const hasRightRoom = offsetRight <= windowWidth - sidePadding;

        if (!hasRightRoom) {
            const rightDifference = offsetRight - (windowWidth - sidePadding);

            offsetRight -= rightDifference;
            offsetLeft -= rightDifference;

            hasLeftRoom = offsetLeft >= sidePadding;

            if (!hasLeftRoom) {
                return sidePadding;
            }
        }

        return offsetLeft;
    }

    const leftDifference = sidePadding - offsetLeft;

    offsetRight += leftDifference;
    offsetLeft += leftDifference;

    const hasRightRoom = offsetRight <= windowWidth - sidePadding;

    if (!hasRightRoom) {
        return sidePadding;
    }

    return offsetLeft;
}

function dockLeftRight(
    anchorRect: DOMRect,
    finalWidth: number,
    windowWidth: number,
    sidePadding: number,
    dockRight: boolean,
): RenderResult {
    if (!dockRight) {
        const rightPositionRight = anchorRect.left + finalWidth + sidePadding;

        if (rightPositionRight <= windowWidth) {
            return {
                styles: {
                    left: buildPx(anchorRect.left),
                },
                location: 'left',
            };
        }
    }

    const leftPositionRight = anchorRect.right - finalWidth - sidePadding;

    if (leftPositionRight >= 0) {
        return {
            styles: {
                left: buildPx(anchorRect.right - finalWidth),
            },
            location: 'right',
        };
    }

    return {
        styles: {
            left: buildPx(sidePadding),
        },
        location: 'left',
    };
}

interface AlignmentValues {
    anchorRect: DOMRect;
    finalWidth: number;
    windowWidth: number;
    sidePadding: number;
    horizontallyCenter: boolean;
    dockRight: boolean;
}

function determineLeftAlignment(
    alignmentValues: AlignmentValues,
    force: boolean,
): RenderResult | null {
    const {
        anchorRect,
        finalWidth,
        windowWidth,
        sidePadding,
        horizontallyCenter,
        dockRight,
    } = alignmentValues;

    const anchorLeftClipped = anchorRect.left < sidePadding;

    if (anchorLeftClipped) {
        if (force) {
            return {
                styles: {
                    left: buildPx(sidePadding),
                },
                location: 'left',
            };
        }

        return null;
    }

    const anchorRightClipped = anchorRect.right > windowWidth - sidePadding;

    if (
        anchorRightClipped
    ) {
        if (force) {
            return {
                styles: {
                    right: buildPx(sidePadding),
                },
                location: 'right',
            };
        }

        return null;
    }

    if (horizontallyCenter) {
        return {
            styles: {
                left: buildPx(
                    centerHorizontally(
                        anchorRect,
                        finalWidth,
                        windowWidth,
                        sidePadding,
                    ),
                ),
            },
            location: 'middle',
        };
    }

    return dockLeftRight(
        anchorRect,
        finalWidth,
        windowWidth,
        sidePadding,
        dockRight,
    );
}

function getFinalHeights(
    renderingParameters: RenderingParameters,
    positionValues: PositionValues,
    isClipped: boolean,
    force: boolean,
): { finalHeight: number } | null {
    const { trayRect, windowHeight } = renderingParameters;
    const { fromPosition, toPosition } = positionValues;
    let finalHeight = trayRect.height;

    const allowedMaxHeight = determineAllowedHeight(
        windowHeight,
        {
            fromPosition,
            toPosition,
        },
    );

    if (allowedMaxHeight <= 0) {
        return null;
    }

    if (allowedMaxHeight <= finalHeight) {
        if (force || isClipped) {
            finalHeight = allowedMaxHeight;
        } else {
            return null;
        }
    }

    return {
        finalHeight,
    };
}

function attemptBottomRender(
    renderingParameters: RenderingParameters,
    force: boolean,
): RenderResult | null {
    const {
        anchorRect,
        windowWidth,
        sidePadding,
        paddingValue,
        trayRect,
        horizontallyCenter,
        dockRight,
        tailOffset,
    } = renderingParameters;

    const top = anchorRect.bottom + paddingValue + tailOffset;

    const isClipped = anchorRect.top < sidePadding;

    const finalHeights = getFinalHeights(
        renderingParameters,
        {
            fromPosition: top,
            toPosition: sidePadding,
        },
        isClipped,
        force,
    );

    if (isNil(finalHeights)) {
        return null;
    }

    const finalWidth = trayRect.width;

    const trayStylingResult = determineLeftAlignment(
        {
            anchorRect,
            finalWidth,
            windowWidth,
            sidePadding,
            horizontallyCenter,
            dockRight,
        },
        force,
    );

    if (isNil(trayStylingResult)) {
        return null;
    }

    const { styles: alignmentStyles, location } = trayStylingResult;

    return {
        styles: {
            ...alignmentStyles,
            top: buildPx(top),
        },
        location,
    };
}

function attemptTopRender(
    renderingParameters: RenderingParameters,
    force: boolean,
): RenderResult | null {
    const {
        anchorRect,
        windowHeight,
        windowWidth,
        sidePadding,
        paddingValue,
        trayRect,
        horizontallyCenter,
        dockRight,
        tailOffset,
    } = renderingParameters;

    const bottom = windowHeight - anchorRect.top + paddingValue + tailOffset;

    const isClipped = anchorRect.bottom > windowHeight + sidePadding;

    const finalHeights = getFinalHeights(
        renderingParameters,
        {
            fromPosition: sidePadding,
            toPosition: bottom,
        },
        isClipped,
        force,
    );

    if (isNil(finalHeights)) {
        return null;
    }

    const finalWidth = trayRect.width;

    const trayStylingResult = determineLeftAlignment(
        {
            anchorRect,
            finalWidth,
            windowWidth,
            sidePadding,
            horizontallyCenter,
            dockRight,
        },
        force,
    );

    if (isNil(trayStylingResult)) {
        return null;
    }

    const { styles: alignmentStyles, location } = trayStylingResult;

    const styles = {
        ...alignmentStyles,
        bottom: buildPx(bottom),
    };

    return {
        styles,
        location,
    };
}

function attemptLeftRender(
    renderingParameters: RenderingParameters,
    force: boolean,
): RenderResult | null {
    const {
        anchorRect,
        trayRect,
        paddingValue,
        windowWidth,
        sidePadding,
        tailOffset,
        windowHeight,
    } = renderingParameters;

    const hasZeroRoom = anchorRect.left - paddingValue - sidePadding - tailOffset <= 0;

    if (hasZeroRoom) {
        return null;
    }

    const finalWidth = trayRect.width;

    const needsRoom = anchorRect.left - paddingValue - sidePadding - finalWidth - tailOffset < 0;

    if (needsRoom && !force) {
        return null;
    }

    const isClipped = anchorRect.top < 0 || anchorRect.bottom > windowHeight;

    if (isClipped && !force) {
        return null;
    }

    const trayStylingResultInt = attemptLevel(renderingParameters);

    const { styles, location } = trayStylingResultInt;

    styles.right = buildPx(
        windowWidth - anchorRect.left + paddingValue + tailOffset,
    );

    if (anchorRect.left - trayRect.width - paddingValue - sidePadding < 0) {
        styles.left = buildPx(sidePadding);
    }

    return {
        styles,
        location,
    };
}

function attemptRightRender(
    renderingParameters: RenderingParameters,
    force: boolean,
): RenderResult | null {
    const {
        anchorRect,
        sidePadding,
        paddingValue,
        windowWidth,
        trayRect,
        tailOffset,
        windowHeight,
    } = renderingParameters;

    const hasZeroRoom = anchorRect.right + paddingValue + sidePadding + tailOffset >= windowWidth;

    if (hasZeroRoom) {
        return null;
    }

    const finalWidth = trayRect.width;

    const needsRoom = anchorRect.right
        + paddingValue
        + sidePadding
        + tailOffset
        + finalWidth
        > windowWidth;

    if (needsRoom && !force) {
        return null;
    }

    const isClipped = anchorRect.top < 0 || anchorRect.bottom > windowHeight;

    if (isClipped && !force) {
        return null;
    }

    const { styles, location } = attemptLevel(renderingParameters) || {};

    styles!.left = buildPx(anchorRect.right + paddingValue + tailOffset);

    if (
        anchorRect.right + trayRect.width + paddingValue + sidePadding > windowWidth
    ) {
        styles!.right = buildPx(sidePadding);
    }

    return {
        styles: styles!,
        location: location!,
    };
}

const attemptRenderMap: Record<string, (params: RenderingParameters, force: boolean) => RenderResult | null> = {
    bottom: attemptBottomRender,
    top: attemptTopRender,
    left: attemptLeftRender,
    right: attemptRightRender,
};

interface TrayRenderResult {
    styles: Record<string, string | null>;
    position: string;
    location: string;
}

function executeRenderMethods(
    dropPositions: DropPosition[],
    renderingParameters: RenderingParameters,
    force = false,
): TrayRenderResult | null {
    let results: TrayRenderResult | null = null;

    forEach(dropPositions, (dropPosition) => {
        const attemptRenderMethod = attemptRenderMap[dropPosition];

        if (isNil(attemptRenderMethod)) {
            throw new Error('Invalid Drop Position');
        }

        const trayRenderResult = attemptRenderMethod(
            renderingParameters,
            force,
        );

        if (!isNil(trayRenderResult)) {
            const { styles, location } = trayRenderResult;

            results = {
                styles,
                position: dropPosition,
                location,
            };

            return false;
        }

        return true;
    });

    return results;
}

function setTrayStyles(
    trayElement: HTMLElement,
    dropPositions: DropPosition[],
    renderingParameters: RenderingParameters,
): { position: string; location: string } {
    let trayRenderResult = executeRenderMethods(
        dropPositions,
        renderingParameters,
    );

    if (isNil(trayRenderResult)) {
        trayRenderResult = executeRenderMethods(
            dropPositions,
            renderingParameters,
            true,
        );
    }

    const { styles, position, location } = trayRenderResult!;

    (styles as Record<string, string | number | null>).zIndex = renderingParameters.zIndex;

    applyStyles(trayElement, {
        ...clearStylesMeta,
        ...styles
    });

    if (trayElement.classList.contains('top')) {
        trayElement.classList.replace('top', position);
    } else if (trayElement.classList.contains('bottom')) {
        trayElement.classList.replace('bottom', position);
    } else if (trayElement.classList.contains('left')) {
        trayElement.classList.replace('left', position);
    } else if (trayElement.classList.contains('right')) {
        trayElement.classList.replace('right', position);
    } else {
        trayElement.classList.add(position);
    }

    return {
        position,
        location,
    };
}

interface TailRenderingParameters {
    position: string;
    location: string;
    anchorRect: DOMRect;
    trayRect: DOMRect;
    tailRect: DOMRect;
    windowWidth: number;
    windowHeight: number;
    sidePadding: number;
    zIndex: number;
}

function setVerticalTailLocation(tailRenderingParameters: TailRenderingParameters): Record<string, string | null> {
    const {
        location,
        anchorRect,
        trayRect,
        tailRect,
        windowHeight,
    } = tailRenderingParameters;

    const styles: Record<string, string | null> = {};

    if (location === 'top') {
        if (anchorRect.height < trayRect.height) {
            if (anchorRect.top < trayRect.top) {
                styles.top = buildPx(trayRect.top + cornerRadius);
            } else {
                const anchorCenter = anchorRect.height / 2;
                const tailCenter = tailRect.height / 2;

                styles.top = buildPx(
                    anchorRect.top + anchorCenter - tailCenter,
                );
            }
        } else {
            styles.top = buildPx(trayRect.top + cornerRadius);
        }
    } else if (location === 'bottom') {
        if (anchorRect.height < trayRect.height) {
            if (anchorRect.bottom > trayRect.bottom) {
                styles.bottom = buildPx(
                    windowHeight - trayRect.bottom + cornerRadius,
                );
            } else {
                const anchorCenter = anchorRect.height / 2;
                const tailCenter = tailRect.height / 2;

                styles.top = buildPx(
                    anchorRect.top + anchorCenter - tailCenter,
                );
            }
        } else {
            styles.bottom = buildPx(
                windowHeight - trayRect.bottom + cornerRadius,
            );
        }
    } else {
        const anchorCenter = anchorRect.height / 2;
        const tailCenter = tailRect.height / 2;

        styles.top = buildPx(anchorRect.top + (anchorCenter - tailCenter));
    }

    return styles;
}

function setTailStyles(
    tailElement: HTMLElement,
    tailRenderingParameters: TailRenderingParameters,
): void {
    const {
        position,
        location,
        windowWidth,
        anchorRect,
        trayRect,
        zIndex,
        tailRect,
    } = tailRenderingParameters;

    const styles: Record<string, string | number | null> = {
        zIndex,
    };

    if (position === 'bottom') {
        tailElement.classList.add('bottom');

        styles.top = buildPx(anchorRect.bottom - tailRect.width / 2);

        if (location === 'left') {
            styles.left = buildPx(trayRect.left + cornerRadius);
        } else if (location === 'right') {
            styles.right = buildPx(windowWidth - trayRect.right + cornerRadius);
        } else {
            const anchorCenter = anchorRect.width / 2;
            const tailCenter = tailRect.width / 2;

            styles.left = buildPx(
                anchorRect.left + (anchorCenter - tailCenter),
            );
        }
    } else if (position === 'top') {
        tailElement.classList.add('top');

        styles.top = buildPx(anchorRect.top - tailRect.width / 2);

        if (location === 'left') {
            styles.left = buildPx(trayRect.left + cornerRadius);
        } else if (location === 'right') {
            styles.right = buildPx(windowWidth - trayRect.right + cornerRadius);
        } else {
            const anchorCenter = anchorRect.width / 2;
            const tailCenter = tailRect.width / 2;

            styles.left = buildPx(
                anchorRect.left + (anchorCenter - tailCenter),
            );
        }
    } else if (position === 'left') {
        tailElement.classList.add('left');

        styles.left = buildPx(anchorRect.left - tailRect.height / 2);

        merge(
            styles,
            setVerticalTailLocation(tailRenderingParameters),
        );
    } else if (position === 'right') {
        tailElement.classList.add('right');

        styles.left = buildPx(anchorRect.right - tailRect.height / 2);

        merge(
            styles,
            setVerticalTailLocation(tailRenderingParameters),
        );
    } else {
        // eslint-disable-next-line no-console
        console.warn('drop down arrow not built yet for this');
    }

    merge(tailElement.style, styles);
}

interface TrayProps {
    id?: string | null;
    className?: string | null;
    children?: React.ReactNode;
    open?: boolean;
    dropPositions?: DropPosition[];
    getAnchor: () => HTMLElement | null;
    onClick?: ((event: React.MouseEvent) => void) | null;
    parentPadding?: number | null;
    onContainedFocus?: (() => void) | null;
    onContainedBlur?: ((event: React.FocusEvent) => void) | null;
    minWidth?: number | 'anchor' | null;
    maxWidth?: number | 'anchor' | null;
    maxHeight?: number | null;
    offset?: {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
    } | null;
    horizontallyCenter?: boolean;
    dockRight?: boolean;
    enableTail?: boolean;
}

class Tray extends Component<TrayProps> {
    static contextType = TrayContext;
    declare context: TrayContextValue;

    uuid: string;
    trayRef: React.RefObject<HTMLDivElement | null>;
    tailRef: React.RefObject<HTMLDivElement | null>;
    childTrays: Record<string, Tray>;
    cleanUp: () => void;
    pendingBlur: boolean;

    constructor(props: TrayProps) {
        super(props);

        this.uuid = shortId();
        this.trayRef = createRef();
        this.tailRef = createRef();
        this.childTrays = {};
        this.cleanUp = noop;
        this.pendingBlur = false;

        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }

    componentDidMount(): void {
        const {
            onRegister,
        } = this.context;

        this.cleanUp = onRegister(this);
    }

    componentDidUpdate(previousProps: TrayProps): void {
        const { open: wasOpen } = previousProps;
        const { open: isOpen } = this.props;

        this.updatePosition(isOpen, wasOpen);
    }

    componentWillUnmount(): void {
        if (!isNil(this.cleanUp)) {
            this.cleanUp();
        }
    }

    handleFocus(): void {
        if (!this.pendingBlur) {
            const { onContainedFocus } = this.props;

            if (!isNil(onContainedFocus)) {
                onContainedFocus();
            }
        }

        this.pendingBlur = false;
    }

    handleBlur(event: React.FocusEvent): void {
        setTimeout(() => {
            const { onContainedBlur } = this.props;

            if (!isNil(onContainedBlur) && this.pendingBlur) {
                onContainedBlur(event);
            }
        }, 1);

        this.pendingBlur = true;

        event.persist();
    }

    handleRegister(component: Tray): () => void {
        this.childTrays[component.uuid] = component;

        return () => {
            delete this.childTrays[component.uuid];
        };
    }

    rootElement(): HTMLDivElement | null {
        return this.trayRef.current;
    }

    contains(targetElement: HTMLElement): boolean {
        if (isNil(this.trayRef.current)) {
            return false;
        }

        if (targetElement === this.trayRef.current) {
            return true;
        }

        if (this.trayRef.current.contains(targetElement)) {
            return true;
        }

        let found = false;

        forEach(this.childTrays, (childTray) => {
            found = childTray.contains(targetElement);

            return !found;
        });

        return found;
    }

    updatePosition(isOpen: boolean | undefined, wasOpen: boolean | undefined): void {
        const { renderIndex } = this.context;

        const {
            getAnchor,
            dropPositions,
            parentPadding,
            offset,
            horizontallyCenter = false,
            dockRight = false,
            enableTail,
        } = this.props;

        if (!isOpen && !wasOpen) {
            return;
        }

        if (isNil(this.trayRef.current)) {
            return;
        }

        const trayElement = this.trayRef.current;
        const tailElement = this.tailRef.current;

        if (!isOpen) {
            clearStyles(trayElement);

            if (!isNil(tailElement)) {
                clearStyles(tailElement);
            }

            return;
        }

        const anchorElement = getAnchor();

        if (isNil(anchorElement)) {
            return;
        }

        const anchorRect = anchorElement.getBoundingClientRect();
        const trayRect = trayElement.getBoundingClientRect();

        const windowWidth = document.documentElement.clientWidth;
        const windowHeight = document.documentElement.clientHeight;

        const sidePadding = 10;

        const paddingValue = !isNil(parentPadding) ? parentPadding : 0;

        const tailOffsetValue = enableTail ? 12 : 0;
        const zIndex = renderIndex + 2000;

        const renderingParameters: RenderingParameters = {
            anchorRect,
            trayRect,
            offset: merge(
                {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                },
                offset,
            ),
            horizontallyCenter,
            dockRight,
            tailOffset: tailOffsetValue,
            sidePadding,
            windowWidth,
            windowHeight,
            paddingValue,
            zIndex,
        };

        const { position, location } = setTrayStyles(
            trayElement,
            dropPositions || DEFAULT_DROP_POSITIONS,
            renderingParameters,
        );

        if (!isNil(tailElement) && !isNil(position)) {
            const tailRect = tailElement.getBoundingClientRect();

            const tailRenderingParameters: TailRenderingParameters = {
                anchorRect,
                trayRect: trayElement.getBoundingClientRect(),
                position,
                location,
                sidePadding,
                windowWidth,
                windowHeight,
                zIndex,
                tailRect,
            };

            setTailStyles(tailElement, tailRenderingParameters);
        }
    }

    render(): React.ReactElement {
        const { renderIndex } = this.context;

        const {
            id,
            className,
            children,
            onClick,
            open = false,
            enableTail = false,
            maxHeight,
            getAnchor,
        } = this.props;

        let { minWidth, maxWidth } = this.props;

        if (minWidth === 'anchor' || maxWidth === 'anchor') {
            const anchor = getAnchor();

            if (!isNil(anchor)) {
                const width = anchor.clientWidth;

                if (minWidth === 'anchor') {
                    minWidth = width;
                }

                if (maxWidth === 'anchor') {
                    maxWidth = width;
                }
            }
        }

        const tail = enableTail ? (
            <div
                ref={this.tailRef}
                className={classnames('ra-tray-tail', {
                    'active-hidden': !open,
                })}
            />
        ) : null;

        const tray = (
            <TrayContext.Provider
                // eslint-disable-next-line react/jsx-no-constructed-context-values
                value={{
                    renderIndex: renderIndex + 1,
                    onRegister: this.handleRegister,
                }}
            >
                <div
                    id={id ?? undefined}
                    role="presentation"
                    ref={this.trayRef}
                    className={classnames(
                        'ra-tray',
                        { 'active-hidden': !open },
                        className,
                    )}
                    tabIndex={-1}
                    onClick={onClick ?? undefined}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    style={{
                        maxHeight: maxHeight ?? undefined,
                        minWidth: (minWidth as number) ?? undefined,
                        maxWidth: (maxWidth as number) ?? undefined,
                    }}
                >
                    {children}
                </div>
                {tail}
            </TrayContext.Provider>
        );

        return ReactDOM.createPortal(tray, window.document.body) as React.ReactElement;
    }
}

export default Tray;
