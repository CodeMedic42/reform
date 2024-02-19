/* eslint-disable react/jsx-props-no-spreading */
import React, {
    Component,
    createContext,
    createRef,
} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import forEach from 'lodash/forEach';
import merge from 'lodash/merge';
import isNil from 'lodash/isNil';
import noop from 'lodash/noop';
import shortId from 'shortid';

const TrayContext = createContext({
    renderIndex: 0,
    onRegister: () => noop,
});

const DEFAULT_DROP_POSITIONS = ['bottom', 'top', 'right', 'left'];

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

const clearStylesMeta = {
    top: null,
    left: null,
    bottom: null,
    right: null,
    zIndex: null,
};

function applyStyles(trayElement, styles) {
    forEach(styles, (styleValue, styleId) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const trayElementStyle = trayElement.style;

        if (trayElementStyle[styleId] !== styleValue) {
            // eslint-disable-next-line no-param-reassign
            trayElementStyle[styleId] = styleValue;
        }
    });
}

function clearStyles(trayElement) {
    applyStyles(trayElement, clearStylesMeta);

    trayElement.classList.remove('top');
    trayElement.classList.remove('bottom');
    trayElement.classList.remove('left');
    trayElement.classList.remove('right');
}

function buildPx(value) {
    return !isNil(value) ? `${value}px` : null;
}

function determineAllowedHeight(windowHeight, positionValues) {
    const {
        fromPosition, // Where to start the calc from.
        toPosition,
    } = positionValues;

    // The height of the window minus the from position and minus the sidePadding will result
    // in the maximum height the tray can grow before it spills out the bottom of
    // the window and get gets clipped. Here the sidePadding provides buffer at the
    // bottom to give some space
    // between the bottom the tray and the bottom of the window.
    return windowHeight - fromPosition - toPosition;
}

function attemptLevelTop(renderingParameters) {
    // Here we attempt to level the top of the tray with the top of the anchoring parent.
    const {
        anchorRect,
        windowHeight,
        sidePadding,
        offset: { top: topOffset },
        trayRect,
    } = renderingParameters;

    // Where we want to try to render the tray. The offset comes from props. This is a way for the
    // developer to align the tray as necessary.
    const topPosition = anchorRect.top + topOffset;

    if (topPosition < sidePadding) {
        // The top position is too close to the top.
        return null;
    }

    const finalHeight = trayRect.height;

    const allowedMaxHeight = determineAllowedHeight(
        windowHeight,
        {
            fromPosition: topPosition, // Where we want to try to render the tray.
            toPosition: sidePadding,
        },
    );

    if (allowedMaxHeight <= 0) {
        return null;
    }

    if (allowedMaxHeight < finalHeight) {
        return null;
    }

    // Using that height information we need to see where the bottom of the tray will render at.
    // We take where we want to render the tray, plus the final height of the tray,
    // plus the padding at the bottom between the the tray and the bottom of the window.
    const bottomPosition = topPosition + finalHeight + sidePadding;

    // If this value is below the bottom the screen then the tray is too close
    // to the bottom and we cannot render here.
    const hasRoom = bottomPosition <= windowHeight;

    if (!hasRoom) {
        return null;
    }

    // Otherwise lets set some styles.
    // The top will position the tray.
    // The maxHeight is in case the contents of the tray are dynamic while the tray is open.
    // This lets the tray still grow as needed.
    return {
        top: buildPx(topPosition),
    };
}

function attemptLevelBottom(renderingParameters) {
    const {
        anchorRect,
        windowHeight,
        sidePadding,
        offset: { bottom: bottomOffset },
        trayRect,
    } = renderingParameters;

    const bottomPosition = windowHeight - anchorRect.bottom + bottomOffset;

    if (bottomPosition < sidePadding) {
        // The top position is too close to the top. Let's just use the sidePadding.
        // Also since it is too close to the top we also know we cannot render either bottom or
        // middle so we know this is the best choice.
        // bottomPosition = sidePadding;

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

function attemptLevelMiddle(renderingParameters) {
    const {
        sidePadding, windowHeight, trayRect, anchorRect,
    } = renderingParameters;

    const finalHeight = trayRect.height;

    const styles = {};

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

// If rendering left or right this will level the tray with the anchor vertically.
function attemptLevel(renderingParameters) {
    // First try to level with the top of the parent
    let styles = attemptLevelTop(renderingParameters);

    if (!isNil(styles)) {
        return {
            styles,
            location: 'top',
        };
    }

    // Next try to level with the bottom of the parent
    styles = attemptLevelBottom(renderingParameters);

    if (!isNil(styles)) {
        return {
            styles,
            location: 'bottom',
        };
    }

    // Finally fit the tray somewhere in the middle.
    return {
        styles: attemptLevelMiddle(renderingParameters),
        location: 'middle',
    };
}

function calcCenter(trayWidth, otherWidth) {
    return (trayWidth - otherWidth) / 2;
}

function centerHorizontally(
    anchorRect,
    finalWidth,
    windowWidth,
    sidePadding,
) {
    let offsetLeft = 0;
    let offsetRight = 0;

    // Here we want to calc an additional offset from the left
    // to center the tray to the anchor.
    const halfWidth = calcCenter(finalWidth, anchorRect.width);

    offsetLeft = anchorRect.left - halfWidth;
    offsetRight = anchorRect.right + halfWidth;

    let hasLeftRoom = offsetLeft >= sidePadding;

    // We need to go through a series of check to make sure it all looks right.
    if (hasLeftRoom) {
        // We have enough room on the left to fit the tray centered.

        // But we also need to check to see if we have enough room on the right.
        const hasRightRoom = offsetRight <= windowWidth - sidePadding;

        if (!hasRightRoom) {
            // If we do not have enough room on the right then we need to
            // shift the tray left based on the right overflow amount..
            const rightDifference = offsetRight - (windowWidth - sidePadding);

            offsetRight -= rightDifference;
            offsetLeft -= rightDifference;

            hasLeftRoom = offsetLeft >= sidePadding;

            // But we also need to check to see if we ar clipping the on the left again.
            if (!hasLeftRoom) {
                // I guess we are and the tray is too wide either way.
                return sidePadding;
            }
        }

        // Ah we have a left offset!
        return offsetLeft;
    }

    // Ok we do not have enough room on the left.

    // Let's try shifting the tray to the right.
    const leftDifference = sidePadding - offsetLeft;

    offsetRight += leftDifference;
    offsetLeft += leftDifference;

    const hasRightRoom = offsetRight <= windowWidth - sidePadding;

    // Do we have enough room on the right?
    if (!hasRightRoom) {
        // Nope we don't.
        return sidePadding;
    }

    // I guess we do!
    return offsetLeft;
}

function dockLeftRight(
    anchorRect,
    finalWidth,
    windowWidth,
    sidePadding,
    dockRight,
) {
    // This is used to set a location horizontally above or below the anchor.

    if (!dockRight) {
        // If we were to dock to the left then we need to check if clipped on the right.
        const rightPositionRight = anchorRect.left + finalWidth + sidePadding;

        if (rightPositionRight <= windowWidth) {
            // Looks like we are not clipped on the right.

            return {
                styles: {
                    left: buildPx(anchorRect.left),
                },
                location: 'left',
            };
        }
    }

    // Okay so we are too close to the right. So if we were to dock from the right
    // the we need to check if clipped on the left.
    const leftPositionRight = anchorRect.right - finalWidth - sidePadding;

    if (leftPositionRight >= 0) {
        return {
            styles: {
                left: buildPx(anchorRect.right - finalWidth),
            },
            location: 'right',
        };
    }

    // We have no great solution so we will just dock matching the anchor
    // on the left and the tray will just be clipped by the window on the right.
    // By the way the rest of the system works this is increasingly an edge case.
    return {
        styles: {
            left: buildPx(sidePadding),
        },
        location: 'left',
    };
}

function determineLeftAlignment(
    alignmentValues,
    force,
) {
    const {
        anchorRect,
        finalWidth,
        windowWidth,
        sidePadding,
        horizontallyCenter,
        dockRight,
    } = alignmentValues;

    const anchorLeftClipped = anchorRect.left < sidePadding;

    // If the anchor is clipped on the left of the window or is past the width of the sidePadding
    // then there is nothing we can do but just dock the tray to the left
    // of the window and hope for the best.
    if (anchorLeftClipped) {
        // But only do this if we are forced to.
        if (force) {
            return {
                styles: {
                    left: buildPx(sidePadding),
                },
                location: 'left',
            };
        }

        // If we are not forcing then let the rest of the system try another
        // position like right or left before we do anything crazy.
        // FYI Top should come to the same result since it uses this function.
        return null;
    }

    const anchorRightClipped = anchorRect.right > windowWidth - sidePadding;

    // If the anchor is clipped on the right of the window or is past the width of the sidePadding
    // then there is nothing we can do but just dock the tray to the right
    // of the window and hope for the best.
    if (
        anchorRightClipped
    ) {
        // But only do this if we are forced to.
        if (force) {
            return {
                styles: {
                    right: buildPx(sidePadding),
                },
                location: 'right',
            };
        }

        // If we are not forcing then let the rest of the system try another
        // position like right or left before we do anything crazy.
        // FYI Top should come to the same result since it uses this function.
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
    renderingParameters,
    positionValues,
    isClipped,
    force,
) {
    const { trayRect, windowHeight } = renderingParameters;
    const { fromPosition, toPosition } = positionValues;
    let finalHeight = trayRect.height;

    // The allowed height is the absolute max the tray can grow to before
    // clipping over the bottom of the window. This means that the
    // allowedMaxHeight is from the top position of the tray down to the
    // bottom of the window.
    const allowedMaxHeight = determineAllowedHeight(
        windowHeight,
        {
            fromPosition,
            toPosition,
        },
    );

    if (allowedMaxHeight <= 0) {
        // There just is no room. Even forced this will not work.
        return null;
    }

    if (allowedMaxHeight <= finalHeight) {
        // If we have a valid allowedMaxHeight but it is smaller than the height of the tray,
        // then should try another position. When it comes to height, the left and right positions
        // are the best and should take it as long as they have horizontal room.

        if (force || isClipped) {
            // If however we are forced to render then we will just use the allowedMaxHeight
            // and hope the tray has a scrolling context.

            // Also if the anchor is clipped at the top then left and right actually NOT
            // be the right way to go. This is more of an aesthetic decision.
            finalHeight = allowedMaxHeight;
            // maxHeight = buildPx(allowedMaxHeight);
        } else {
            // Otherwise let's try another position.
            return null;
        }
    }

    return {
        finalHeight,
    };
}

// Checks to see if below the parent has room.
// If it does then render there.
function attemptBottomRender(
    renderingParameters,
    force,
) {
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

    // This represents the top most position possible for the tray
    // when positioning it below the anchor.
    const top = anchorRect.bottom + paddingValue + tailOffset;

    // This is used to see if the anchor is clipped at the top.
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

    // If this is nill then that means that we might not have enough room.
    if (isNil(finalHeights)) {
        return null;
    }

    const finalWidth = trayRect.width;

    // Now we need to figure out where we will render horizontally the tray below the anchor.
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

    // If the above does not like what is available then we need to try another position.
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

// Checks to see if above the parent has room.
// If it does then render there.
function attemptTopRender(
    renderingParameters,
    force,
) {
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

    // This represents the bottom most position possible for the tray
    // when positioning it above the anchor.
    const bottom = windowHeight - anchorRect.top + paddingValue + tailOffset;

    // This is used to see if the anchor is clipped at the bottom.
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

    // If this is nill then that means that we might not have enough room.
    if (isNil(finalHeights)) {
        return null;
    }

    const finalWidth = trayRect.width;

    // Now we need to figure out where we will render horizontally the tray below the anchor.
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

// Checks to see if to the left the parent has room.
// If it does then render there.
function attemptLeftRender(
    renderingParameters,
    force,
) {
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
        // THERE NO ROOM AT ALL. Even if we render here the user will see nothing useful.
        return null;
    }

    const finalWidth = trayRect.width;

    const needsRoom = anchorRect.left - paddingValue - sidePadding - finalWidth - tailOffset < 0;

    if (needsRoom && !force) {
        // Okay there is SOME room but not enough for the whole width
        // of the tray. Let's try another position. That is unless we
        // are forced to.
        return null;
    }

    const isClipped = anchorRect.top < 0 || anchorRect.bottom > windowHeight;

    if (isClipped && !force) {
        // Okay the anchor is clipped either on the top or bottom.
        // Since most anchors have a width greater than their height
        // it might be easier to try top or bottom. They have code
        // that checks for this clipping as well and will render
        // it if this is true. This is an aesthetic choice.
        return null;
    }

    // This will position the tray vertically to get the location.
    const trayStylingResultInt = attemptLevel(renderingParameters);

    const { styles, location } = trayStylingResultInt;

    // This will position the the tray to the left of the anchor.
    styles.right = buildPx(
        windowWidth - anchorRect.left + paddingValue + tailOffset,
    );

    if (anchorRect.left - trayRect.width - paddingValue - sidePadding < 0) {
        // This will keep the tray from spilling outside the screen.
        styles.left = buildPx(sidePadding);
    }

    return {
        styles,
        location,
    };
}

// Checks to see if to the right the parent has room.
// If it does then render there.
function attemptRightRender(
    renderingParameters,
    force,
) {
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
        // THERE NO ROOM AT ALL. Even if we render here the user will see nothing useful.
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
        // Okay there is SOME room but not enough for the whole width
        // of the tray. Let's try another position. That is unless we
        // are forced to.
        return null;
    }

    const isClipped = anchorRect.top < 0 || anchorRect.bottom > windowHeight;

    if (isClipped && !force) {
        // Okay the anchor is clipped either on the top or bottom.
        // Since most anchors have a width greater than their height it
        // might be easier to try top or bottom. They have code that
        // checks for this clipping as well and will render it if
        // this is true. This is an aesthetic choice.
        return null;
    }

    // This will position the tray vertically to get the location.
    const { styles, location } = attemptLevel(renderingParameters) || {};

    // This will position the the tray to the right of the anchor.
    styles.left = buildPx(anchorRect.right + paddingValue + tailOffset);

    if (
        anchorRect.right + trayRect.width + paddingValue + sidePadding > windowWidth
    ) {
        // This will keep the tray from spilling outside the screen.
        styles.right = buildPx(sidePadding);
    }

    return {
        styles,
        location,
    };
}

const attemptRender = {
    bottom: attemptBottomRender,
    top: attemptTopRender,
    left: attemptLeftRender,
    right: attemptRightRender,
};

function executeRenderMethods(
    dropPositions,
    renderingParameters,
    force = false,
) {
    let results = null;

    // Loop over each drop position in order.
    forEach(dropPositions, (dropPosition) => {
        const attemptRenderMethod = attemptRender[dropPosition];

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

            // Stop Here
            return false;
        }

        // Keep going
        return true;
    });

    return results;
}

function setTrayStyles(
    trayElement,
    dropPositions,
    renderingParameters,
) {
    let trayRenderResult = executeRenderMethods(
        dropPositions,
        renderingParameters,
    );

    if (isNil(trayRenderResult)) {
        // If a good candidate was not found lets see if can
        // find one that at least works well enough.
        trayRenderResult = executeRenderMethods(
            dropPositions,
            renderingParameters,
            true,
        );
    }

    const { styles, position, location } = trayRenderResult;

    styles.zIndex = renderingParameters.zIndex;

    applyStyles(trayElement, {
        ...clearStylesMeta,
        ...styles
    });

    // This is in case we need to do something extra special in the css.
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

    // These are used for the tail if needed.
    return {
        position,
        location,
    };
}

function setVerticalTailLocation(tailRenderingParameters) {
    const {
        location,
        anchorRect,
        trayRect,
        tailRect,
        windowHeight,
    } = tailRenderingParameters;

    const styles = {};

    if (location === 'top') {
        if (anchorRect.height < trayRect.height) {
            // Since th tray is larger than the anchor we need to
            // focus on centering on the anchor.
            if (anchorRect.top < trayRect.top) {
                // Unless the anchor is above the tray. In this case just
                // dock the arrow to the bottom of the tray.
                styles.top = buildPx(trayRect.top + cornerRadius);
            } else {
                // Center the arrow on the anchor.
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
            // Since th tray is larger than the anchor we need to
            // focus on centering on the anchor.
            if (anchorRect.bottom > trayRect.bottom) {
                // Unless the anchor is below the tray. In this case just
                // dock the arrow to the bottom of the tray.
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
    tailElement,
    tailRenderingParameters,
) {
    const {
        position,
        location,
        windowWidth,
        anchorRect,
        trayRect,
        zIndex,
        tailRect,
    } = tailRenderingParameters;

    const styles = {
        zIndex,
    };

    if (position === 'bottom') {
        tailElement.classList.add('bottom');

        // 8 represents the half the width of the tail.
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

        // 8 represents the half the width of the tail.
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

        // 8 represents the half the width of the tail.
        styles.left = buildPx(anchorRect.left - tailRect.height / 2);

        merge(
            styles,
            setVerticalTailLocation(tailRenderingParameters),
        );
    } else if (position === 'right') {
        tailElement.classList.add('right');

        // 8 represents the half the width of the tail.
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

const dropPositionTypes = PropTypes.oneOf(['top', 'bottom', 'left', 'right']);

class Tray extends Component {
    static propTypes = {
        id: PropTypes.string,
        className: PropTypes.string,
        children: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.arrayOf(PropTypes.node),
        ]),
        open: PropTypes.bool,
        dropPositions: PropTypes.arrayOf(dropPositionTypes),
        getAnchor: PropTypes.func.isRequired,
        onClick: PropTypes.func,
        parentPadding: PropTypes.number,
        onContainedFocus: PropTypes.func,
        onContainedBlur: PropTypes.func,
        minWidth: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.oneOf(['anchor']),
        ]),
        maxWidth: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.oneOf(['anchor']),
        ]),
        maxHeight: PropTypes.number,
        offset: PropTypes.shape({
            left: PropTypes.number,
            right: PropTypes.number,
            top: PropTypes.number,
            bottom: PropTypes.number,
        }),
        horizontallyCenter: PropTypes.bool,
        dockRight: PropTypes.bool,
        enableTail: PropTypes.bool,
    };

    static defaultProps = {
        id: null,
        className: null,
        open: false,
        children: null,
        dropPositions: ['bottom', 'top', 'right', 'left'],
        onClick: null,
        parentPadding: null,
        onContainedFocus: null,
        onContainedBlur: null,
        minWidth: null,
        maxWidth: null,
        maxHeight: null,
        offset: null,
        horizontallyCenter: false,
        dockRight: false,
        enableTail: false,
    };

    static contextType = TrayContext;

    constructor(props) {
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

    componentDidMount() {
        const {
            onRegister,
        } = this.context;

        this.cleanUp = onRegister(this);
    }

    componentDidUpdate(previousProps) {
        const { open: wasOpen } = previousProps;
        const { open: isOpen } = this.props;

        this.updatePosition(isOpen, wasOpen);
    }

    componentWillUnmount() {
        if (!isNil(this.cleanUp)) {
            this.cleanUp();
        }
    }

    handleFocus() {
        if (!this.pendingBlur) {
            const { onContainedFocus } = this.props;

            if (!isNil(onContainedFocus)) {
                onContainedFocus();
            }
        }

        this.pendingBlur = false;
    }

    handleBlur(event) {
        setTimeout(() => {
            const { onContainedBlur } = this.props;

            if (!isNil(onContainedBlur) && this.pendingBlur) {
                onContainedBlur(event);
            }
        }, 1);

        this.pendingBlur = true;

        event.persist();
    }

    handleRegister(component) {
        this.childTrays[component.uuid] = component;

        return () => {
            delete this.childTrays[component.uuid];
        };
    }

    rootElement() {
        return this.trayRef.current;
    }

    contains(targetElement) {
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

    updatePosition(isOpen, wasOpen) {
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

        // Tray styles are updated by reference rather than through react here.
        // The reason is that these style calculations can only happen after
        // a render to get the size of the tray.
        // We could call setState and incur a second render each time a render happens,
        // but, this does not sound like a good idea.
        // Also this would create an infinite loop unless we call setState conditionally
        // based on the previous styles and the new ones.
        // The problem is the size of the tray is dependant on the children it contains.
        // We cannot guarantee that the size of the children do not change from render to render.
        // We could still end up in another infinite loop.

        if (isNil(this.trayRef.current)) {
            return;
        }

        // We need the exact elements to do this right
        const trayElement = this.trayRef.current;
        const tailElement = this.tailRef.current;

        if (!isOpen) {
            // Only clear the styles when not open. Part of the reason for this is because if the
            // the styles change too much it might affect the scroll position of a possible scrolled
            // element. If we need to reset styles while open we need to
            // clear them individually when
            // new styles are set.
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

        // We will also need the current rect info for each element.
        const anchorRect = anchorElement.getBoundingClientRect();
        const trayRect = trayElement.getBoundingClientRect();

        // The window size is also needed to position the tray.
        const windowWidth = document.documentElement.clientWidth;
        const windowHeight = document.documentElement.clientHeight;

        // This is the padding used between the tray and the window edges.
        const sidePadding = 10;

        // This is the padding used between the anchor and the tray.
        const paddingValue = !isNil(parentPadding) ? parentPadding : 0;

        const tailOffset = enableTail ? 12 : 0;
        const zIndex = renderIndex + 2000;

        const renderingParameters = {
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
            tailOffset,
            sidePadding,
            windowWidth,
            windowHeight,
            paddingValue,
            zIndex,
        };

        // Set the styles to position and size the tray.
        const { position, location } = setTrayStyles(
            trayElement,
            dropPositions || DEFAULT_DROP_POSITIONS,
            renderingParameters,
        );

        if (!isNil(tailElement) && !isNil(position)) {
            // Let's get this AFTER we ally the styles.
            const tailRect = tailElement.getBoundingClientRect();

            const tailRenderingParameters = {
                anchorRect,
                // TODO: Review this. It probably is forcing a repaint.
                trayRect: trayElement.getBoundingClientRect(),
                position,
                location,
                sidePadding,
                windowWidth,
                windowHeight,
                zIndex,
                tailRect,
            };

            // If we have a tail element then we need to position it.
            setTailStyles(tailElement, tailRenderingParameters);
        }
    }

    render() {
        const { renderIndex } = this.context;

        const {
            id,
            className,
            children,
            onClick,
            open,
            enableTail,
            maxHeight,
            getAnchor,
        } = this.props;

        let { minWidth, maxWidth } = this.props;

        if (minWidth === 'anchor' || maxWidth === 'anchor') {
            // TODO: This requires the component to be mounted which
            // will not be true the first time through.
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
                    id={id}
                    role="presentation"
                    ref={this.trayRef}
                    className={classnames(
                        'ra-tray',
                        { 'active-hidden': !open },
                        className,
                    )}
                    tabIndex={-1}
                    onClick={onClick}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    style={{
                        maxHeight,
                        minWidth,
                        maxWidth,
                    }}
                >
                    {children}
                </div>
                {tail}
            </TrayContext.Provider>
        );

        return ReactDOM.createPortal(tray, window.document.body);
    }
}

export default Tray;
