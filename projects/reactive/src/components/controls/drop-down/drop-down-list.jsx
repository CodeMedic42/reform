import React, { Component, createRef } from 'react';
// import PropTypes from 'prop-types';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import scrollIntoView from 'scroll-into-view-if-needed';
import PropTypes from '../../../common/prop-types';

// interface DropDownListPropsInt {
//     id?: string,
//     className?: string,
//     size: 'sm' | 'md' | 'lg',
//     'aria-labelledby'?: string,
// }

function scrollTo(listElement, targetIndex) {
    const optionElement = listElement.childNodes[targetIndex];

    if (isNil(optionElement)) {
        return;
    }

    scrollIntoView(optionElement, {
        scrollMode: 'always',
        block: 'center',
        inline: 'center',
        boundary: listElement,
    });
}

/**
 * This component is used within the Tray component. It is normally used within the DropDown component.
 */
class DropDownList extends Component {
    static propTypes = {
        id: PropTypes.string,
        className: PropTypes.string,
        children: PropTypes.children,
        size: PropTypes.string,
        'aria-labelledby': PropTypes.string,
    };

    static defaultProps = {
        id: null,
        className: null,
        children: null,
        size: null,
        'aria-labelledby': null,
    };

    constructor(props) {
        super(props);

        this.listRef = createRef();

        this.handleWheel = this.handleWheel.bind(this);
    }

    componentDidMount() {
        if (!isNil(this.listRef.current)) {
            this.listRef.current.addEventListener('wheel', this.handleWheel, {
                passive: false,
                capture: false,
            });
        }
    }

    componentWillUnmount() {
        if (!isNil(this.listRef.current)) {
            this.listRef.current.removeEventListener('wheel', this.handleWheel);
        }
    }

    // This method constrains the mouse wheel events to only this element.
    // If the wheel is at the bottom when scrolling down then normally
    // a browser will continue the scroll with a high parent.
    // The purpose of the component is to be used inside the drop down component in the tray.
    // While the tray is open I don't want to scroll anywhere except the tray.
    // This method will prevent that scrolling.
    handleWheel(event) {
        const { deltaY, deltaX } = event;

        if (isNil(this.listRef.current)) {
            return;
        }

        const {
            scrollTop,
            scrollLeft,
            scrollHeight,
            scrollWidth,
            clientHeight,
            clientWidth,
        } = this.listRef.current;

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
    }

    getRootNode() {
        return this.listRef.current;
    }

    scrollToIndex(index) {
        if (isNil(this.listRef.current)) {
            return;
        }

        scrollTo(this.listRef.current, index);
    }

    render() {
        const {
            id,
            className,
            children,
            size,
            'aria-labelledby': ariaLabeledBy,
        } = this.props;

        const sizeClass = !isNil(size) ? `size-${size}` : 'size-md';

        return (
            <ol
                ref={this.listRef}
                id={id}
                className={classnames('ra-dd-list', className, sizeClass)}
                role="listbox"
                aria-labelledby={ariaLabeledBy}
            >
                {children}
            </ol>
        );
    }
}

export default DropDownList;
