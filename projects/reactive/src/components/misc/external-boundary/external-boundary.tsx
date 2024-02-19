import React, {
    Component,
    createRef,
} from 'react';
import isNil from 'lodash/isNil';
import findScrollingContainer from '../../../common/find-scrolling-container';

// let lastCalledFor: Element | null = null;
// let lastCalledForContainer: Element | null = null;
// let timer: ReturnType<typeof setTimeout> | null = null;

// function getScrollContainer(node: Element | null, stop: Element): Element | null {
//     if (isNil(node) || node === stop) {
//         return null;
//     }

//     const { overflowY } = window.getComputedStyle(node);
//     const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';

//     if (isScrollable && node.scrollHeight >= node.clientHeight) {
//         return node;
//     }

//     return getScrollContainer(node.parentElement, stop);
// }

// function findScrollingContainer(node: Element, stop: Element) {
//     if (node === lastCalledFor) {
//         return lastCalledForContainer;
//     }

//     if (!isNil(timer)) {
//         clearTimeout(timer);
//     }

//     timer = setTimeout(() => {
//         lastCalledFor = null;
//         lastCalledForContainer = null;

//         timer = null;
//     }, 500);

//     lastCalledFor = node;

//     lastCalledForContainer = getScrollContainer(node, stop);

//     return lastCalledForContainer;
// }

export interface ExternalBoundaryPropsInt {
    onExternalClick?: (event: MouseEvent) => void,
    cancelExternalScroll?: boolean,
}

class ExternalBoundary extends Component<ExternalBoundaryPropsInt> {
    static defaultProps = {
        onExternalClick: null,
        cancelExternalScroll: false,
    };

    private clickedInside = false;

    private boundaryRef = createRef<HTMLDivElement>();

    private clickListenerUpdate?: (() => void) | null;

    private wheelListenerUpdate?: (() => void) | null;

    constructor(props: ExternalBoundaryPropsInt) {
        super(props);

        this.handleCaptureClick = this.handleCaptureClick.bind(this);
    }

    componentDidMount() {
        const {
            onExternalClick,
            cancelExternalScroll,
        } = this.props;

        if (!isNil(onExternalClick)) {
            this.clickListenerUpdate = this.applyClick;
        }

        if (cancelExternalScroll) {
            this.wheelListenerUpdate = this.applyWheel();
        }
    }

    componentDidUpdate() {
        const {
            onExternalClick,
            cancelExternalScroll,
        } = this.props;

        if (!isNil(onExternalClick)) {
            if (isNil(this.clickListenerUpdate)) {
                this.clickListenerUpdate = this.applyClick;
            }
        } else if (!isNil(this.clickListenerUpdate)) {
            this.clickListenerUpdate();

            this.clickListenerUpdate = null;
        }

        if (cancelExternalScroll) {
            if (isNil(this.wheelListenerUpdate)) {
                this.wheelListenerUpdate = this.applyWheel();
            }
        } else if (!isNil(this.wheelListenerUpdate)) {
            this.wheelListenerUpdate();

            this.wheelListenerUpdate = null;
        }
    }

    componentWillUnmount() {
        if (!isNil(this.clickListenerUpdate)) {
            this.clickListenerUpdate();

            this.clickListenerUpdate = null;
        }

        if (!isNil(this.wheelListenerUpdate)) {
            this.wheelListenerUpdate();

            this.wheelListenerUpdate = null;
        }
    }

    handleCaptureClick() {
        this.clickedInside = true;
    }

    isClicked() {
        return this.clickedInside;
    }

    private applyWheel() {
        const boundaryElement = this.boundaryRef.current;

        if (isNil(boundaryElement)) {
            return null;
        }

        const handleWheel = (event: WheelEvent) => {
            const { deltaY, deltaX, target } = event;

            const scrollingContainer = findScrollingContainer(target as Element, boundaryElement);

            if (isNil(scrollingContainer)) {
                return;
            }

            const {
                scrollTop,
                scrollLeft,
                scrollHeight,
                scrollWidth,
                clientHeight,
                clientWidth,
            } = scrollingContainer;

            event.stopPropagation();

            let stop = false;

            if (deltaY < 0) {
                stop = scrollTop <= 0;
            } else if (deltaY > 0) {
                stop = scrollTop + clientHeight >= scrollHeight;
            }

            if (deltaX < 0) {
                stop = scrollLeft <= 0;
            } else if (deltaX > 0) {
                stop = scrollLeft + clientWidth >= scrollWidth;
            }

            if (stop) {
                event.preventDefault();
            }
        };

        boundaryElement.addEventListener('wheel', handleWheel, {
            passive: false,
            capture: false,
        });

        return () => {
            boundaryElement.removeEventListener('wheel', handleWheel);
        };
    }

    private applyClick() {
        const handleClick = (event: MouseEvent) => {
            const { onExternalClick } = this.props;

            if (!isNil(onExternalClick)) {
                onExternalClick(event);
            }
        };

        // this.clickedInside = false;

        document.addEventListener<'click'>('click', handleClick);

        return () => {
            document.removeEventListener<'click'>('click', handleClick);
        };
    }

    render() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { onExternalClick, cancelExternalScroll, ...rest } = this.props;

        return (
            <div
                {...rest}
                ref={this.boundaryRef}
                onClickCapture={this.handleCaptureClick}
            />
        );
    }
}

export default ExternalBoundary;
