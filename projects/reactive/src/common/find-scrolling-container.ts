import isNil from 'lodash/isNil';
import throttle from 'lodash/throttle';

// let lastCalledFor: Element | null = null;
// let lastCalledForContainer: Element | null = null;
// let timer: ReturnType<typeof setTimeout> | null = null;

function getScrollContainer(node: Element | null, stop: Element): Element | null {
    if (isNil(node) || node === stop) {
        return null;
    }

    const { overflowY } = window.getComputedStyle(node);
    const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';

    if (isScrollable && node.scrollHeight >= node.clientHeight) {
        return node;
    }

    return getScrollContainer(node.parentElement, stop);
}

function findScrollingContainer(node: Element, stop: Element) {
    // if (node === lastCalledFor) {
    //     return lastCalledForContainer;
    // }

    // if (!isNil(timer)) {
    //     clearTimeout(timer);
    // }

    // timer = setTimeout(() => {
    //     lastCalledFor = null;
    //     lastCalledForContainer = null;

    //     timer = null;
    // }, 500);

    // lastCalledFor = node;

    const lastCalledForContainer = getScrollContainer(node, stop);

    return lastCalledForContainer;
}

const throttled = throttle(findScrollingContainer, 500, { leading: true });

export default throttled;
