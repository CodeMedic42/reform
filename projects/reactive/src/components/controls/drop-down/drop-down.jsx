/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-props-no-spreading */
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import noop from 'lodash/noop';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import Tray from '../../arrangement/tray';
import Provider from './drop-down-context';

const DEFAULTS = {
    openOnClick: true,
};

const dropPositionTypes = PropTypes.oneOf(['top', 'bottom', 'left', 'right']);

class DropDown extends Component {
    static propTypes = {
        id: PropTypes.string,
        className: PropTypes.string,
        trayClassName: PropTypes.string,
        children: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.arrayOf(PropTypes.node),
        ]),
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
        disabled: PropTypes.bool,
        dropPositions: PropTypes.arrayOf(dropPositionTypes),
        closeTrayOnClick: PropTypes.bool,
        closeTrayOnEnter: PropTypes.bool,
        minTrayWidth: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.oneOf(['anchor']),
        ]),
        maxTrayWidth: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.oneOf(['anchor']),
        ]),
        maxTrayHeight: PropTypes.number,
        onOpen: PropTypes.func,
        onClose: PropTypes.func,
        onKeyDown: PropTypes.func,
        Anchor: PropTypes.elementType.isRequired,
        // eslint-disable-next-line react/forbid-prop-types
        anchorProps: PropTypes.object,
        openOnHover: PropTypes.bool,
        hoverOpenTime: PropTypes.number,
        autoCloseTime: PropTypes.number,
        openOnFocus: PropTypes.bool,
        onAnchorClick: PropTypes.func,
        openOnClick: PropTypes.bool,
        horizontallyCenter: PropTypes.bool,
        dockRight: PropTypes.bool,
        enableTail: PropTypes.bool,
        onClick: PropTypes.func,
        onOpened: PropTypes.func,
        onClosed: PropTypes.func,
        keepLoaded: PropTypes.bool,
    };

    static defaultProps = {
        id: null,
        className: null,
        trayClassName: null,
        children: null,
        onBlur: noop,
        onFocus: noop,
        disabled: false,
        dropPositions: ['bottom', 'top', 'right', 'left'],
        closeTrayOnClick: true,
        closeTrayOnEnter: true,
        minTrayWidth: null,
        maxTrayWidth: null,
        maxTrayHeight: null,
        onOpen: null,
        onClose: null,
        onKeyDown: null,
        anchorProps: {},
        openOnHover: false,
        hoverOpenTime: 500,
        autoCloseTime: null,
        openOnFocus: false,
        onAnchorClick: noop,
        openOnClick: true,
        horizontallyCenter: false,
        dockRight: false,
        enableTail: false,
        onClick: null,
        onOpened: null,
        onClosed: null,
        keepLoaded: false,
    };

    constructor(props) {
        super(props);

        this.openRef = createRef(false);

        this.openRef.current = false;

        this.mainRef = createRef();

        this.anchorRef = createRef();

        this.trayRef = createRef();

        this.openFromHoverTimer = null;

        this.autoCloseTimer = null;

        this.controlTimer = null;

        this.keyOnce = false;

        this.handleButtonKeyPress = this.handleButtonKeyPress.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleTrayClick = this.handleTrayClick.bind(this);
        this.handleWindowEvent = debounce(
            this.handleWindowEvent.bind(this),
            200,
            {
                leading: true,
                trailing: false,
            },
        );
        // this.handleWindowKeyDown = this.handleWindowKeyDown.bind(this);
        this.handleButtonFocus = this.handleButtonFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        // The debounce here is because there are a lot of different
        // events trying to open and close the tray.
        // It is getting hard to manage them all. Most utilize the
        // current state of the tray to determine what to do.
        // But if one event closes the tray and then another right
        // after it sees the tray closed in the state it will open it back up.
        // The user will see a flicker and then tray never closes.
        // So within a span of 200 milliseconds the first event to
        // fire will close it and then all others will get ignored.
        // There are edge cases here that can happen but I am too tired
        // to try to smooth them out and they require the user to
        // do things like click and hold the mouse for more than 200
        // milliseconds on the select button.
        this.setOpen = debounce(this.setOpen.bind(this), 200, {
            leading: true,
            trailing: false,
        });
        this.focus = this.focus.bind(this);
        this.getAnchor = this.getAnchor.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleAnchorPointerEnter = this.handleAnchorPointerEnter.bind(this);
        this.handleAnchorPointerLeave = this.handleAnchorPointerLeave.bind(this);

        this.state = {
            open: false,
            openFromHover: false,
            openFromFocus: false,
        };
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleWindowEvent, true);
        window.addEventListener('resize', this.handleWindowEvent);
    }

    componentDidUpdate() {
        const {
            onOpened,
            onClosed,
        } = this.props;

        const {
            open
        } = this.state;

        if (this.openRef.current !== open) {
            if (open) {
                if (!isNil(onOpened)) {
                    onOpened();
                }
            } else if (!isNil(onClosed)) {
                onClosed();
            }

            this.openRef.current = open;
        }
    }

    componentWillUnmount() {
        if (this.autoCloseTimer) {
            clearTimeout(this.autoCloseTimer);

            this.autoCloseTimer = null;
        }

        if (!isNil(this.openFromHoverTimer)) {
            clearTimeout(this.openFromHoverTimer);

            this.openFromHoverTimer = null;
        }

        if (!isNil(this.controlTimer)) {
            clearTimeout(this.controlTimer);

            this.controlTimer = null;
        }

        window.removeEventListener('scroll', this.handleWindowEvent, true);
        window.removeEventListener('resize', this.handleWindowEvent);
    }

    handleWindowEvent(event) {
        const { open } = this.state;

        if (!open) {
            return;
        }

        const eventTarget = event.target;

        if (
            eventTarget.nodeType === 1
            && !isNil(this.trayRef.current)
            && this.trayRef.current.contains(eventTarget)
        ) {
            return;
        }

        this.setOpen(false);

        this.focusOnAnchorContent();
    }

    // TODO: Check if this is still needed
    // handleWindowKeyDown(event) {
    //     // This handler will prevent arrow keys from causing a scroll event
    //     // from happening while the tray is open.
    //     const { open } = this.state;

    //     // arrow keys
    //     if (open && [37, 38, 39, 40].indexOf(event.keyCode) > -1) {
    //         event.preventDefault();
    //     }
    // }

    handleButtonKeyPress(event) {
        const { openOnClick = DEFAULTS.openOnClick } = this.props;

        if (openOnClick && event.which === 13) {
            // enter key
            event.preventDefault();
        }
    }

    handleButtonClick(event) {
        if (event.defaultPrevented) {
            return;
        }

        const {
            openOnClick = DEFAULTS.openOnClick,
            onAnchorClick,
        } = this.props;
        const { open } = this.state;

        if (!isNil(onAnchorClick)) {
            onAnchorClick(event);
        }

        if (openOnClick) {
            this.setOpen(!open);
        }
    }

    handleTrayClick(event) {
        const { closeTrayOnClick } = this.props;

        if (closeTrayOnClick && !event.defaultPrevented) {
            this.setOpen(false);

            this.focusOnAnchorContent();
        }
    }

    handleKeyUp() {
        this.keyOnce = false;
    }

    handleKeyDown(event) {
        if (this.keyOnce) {
            return;
        }

        this.keyOnce = true;

        if (event.defaultPrevented) {
            return;
        }

        const { closeTrayOnEnter } = this.props;

        const { open } = this.state;

        if (open) {
            if (
                event.which === 27 // Escape key
                || (closeTrayOnEnter && event.which === 13) // Enter key
            ) {
                // Escape key
                this.setOpen(false);

                this.focusOnAnchorContent();
            } else if (
                event.which === 40 // down arrow
                || event.which === 38 // up arrow
            ) {
                // prevent scroll.
                event.preventDefault();
            }
        } else if (
            event.which === 13 // Enter Key
            || event.which === 40 // down arrow
        ) {
            // open tray
            this.setOpen(true);
            event.preventDefault();
        }
    }

    handleButtonFocus(event) {
        const { onFocus, openOnFocus } = this.props;

        if (openOnFocus) {
            this.setState({ openFromFocus: true });
        }

        if (isNil(onFocus)) {
            return;
        }

        const { open } = this.state;

        if (open) {
            return;
        }

        this.controlTimer = setTimeout(() => {
            this.controlTimer = null;

            onFocus(event);
        }, 1);
    }

    handleBlur(event) {
        const { currentTarget, relatedTarget } = event;

        if (
            (!isNil(this.trayRef.current)
            && this.trayRef.current.contains(relatedTarget))
            || currentTarget.contains(relatedTarget)
        ) {
            return;
        }

        this.setOpen(false);

        const { onBlur } = this.props;

        if (isNil(onBlur)) {
            return;
        }

        onBlur(event);
    }

    handleAnchorPointerEnter() {
        const { hoverOpenTime, openOnHover, disabled } = this.props;

        if (disabled || !openOnHover) {
            return;
        }

        this.openFromHoverTimer = setTimeout(() => {
            this.setState({ openFromHover: true });

            this.openFromHoverTimer = null;
        }, hoverOpenTime);
    }

    handleAnchorPointerLeave() {
        const { openFromHover } = this.state;

        if (!isNil(this.openFromHoverTimer)) {
            clearTimeout(this.openFromHoverTimer);

            this.openFromHoverTimer = null;
        }

        if (openFromHover) {
            this.setState({ openFromHover: false });
        }
    }

    getRootNode() {
        return this.mainRef.current;
    }

    getAnchor() {
        if (isNil(this.anchorRef.current)) {
            return null;
        }

        return this.anchorRef.current.getBoundingElement();
    }

    setOpen(open) {
        const {
            disabled, onOpen, onClose, autoCloseTime,
        } = this.props;

        if (disabled) {
            return;
        }

        const { open: current } = this.state;

        if (current === open) {
            return;
        }

        if (open) {
            if (!isNil(onOpen)) {
                // If we are opening and we have a callback function
                onOpen();
            }
        } else if (!isNil(onClose)) {
            // If we are closing and we have a callback function
            onClose();
        }

        if (!isNil(autoCloseTime)) {
            if (!isNil(this.autoCloseTimer)) {
                clearTimeout(this.autoCloseTimer);

                this.autoCloseTimer = null;
            }

            if (open) {
                this.autoCloseTimer = setTimeout(() => {
                    this.setOpen(false);
                }, autoCloseTime);
            }
        }

        this.setState({
            open,
        });
    }

    focusOnAnchorContent() {
        const focus = get(this.anchorRef, ['current', 'focus']);

        if (isNil(focus)) {
            return;
        }

        focus();
    }

    focus() {
        const { disabled } = this.props;

        if (disabled) {
            return;
        }

        if (isNil(this.anchorRef) || isNil(this.anchorRef.current)) {
            // eslint-disable-next-line no-console
            console.warn('Attempting to focus on an unmounted component');
        }

        this.focusOnAnchorContent();

        // TODO: This was commented out at while tests were being written
        // If the tray should open of focus then that should be on the focus handler
        // which should be called because of this action.
        // This statement should be verified.
        // this.setOpen(true);
    }

    isOpen() {
        const { open } = this.state;

        return open;
    }

    close(focusOnAnchor) {
        this.setOpen(false);

        if (focusOnAnchor) {
            this.focusOnAnchorContent();
        }
    }

    open() {
        this.setOpen(true);
    }

    renderMainControl() {
        const {
            Anchor, anchorProps, openOnHover, onKeyDown,
        } = this.props;

        const { open } = this.state;

        if (isNil(Anchor)) {
            throw new Error('Need Anchor');
        }

        return (
            <Anchor
                anchorProps={anchorProps}
                open={open}
                bindingRef={this.anchorRef}
                bindingInterface={{
                    onClick: this.handleButtonClick,
                    onFocus: this.handleButtonFocus,
                    onKeyPress: this.handleButtonKeyPress,
                    onKeyDown,
                    onPointerEnter: openOnHover
                        ? this.handleAnchorPointerEnter
                        : undefined,
                    onPointerLeave: openOnHover
                        ? this.handleAnchorPointerLeave
                        : undefined,
                    onPointerCancel: openOnHover
                        ? this.handleAnchorPointerLeave
                        : undefined,
                }}
            />
        );
    }

    render() {
        const {
            id,
            className,
            trayClassName,
            children,
            dropPositions,
            minTrayWidth,
            maxTrayWidth,
            maxTrayHeight,
            horizontallyCenter,
            dockRight,
            enableTail,
            onClick,
            keepLoaded,
        } = this.props;

        const { open, openFromHover, openFromFocus } = this.state;

        let tray = null;

        if (open || keepLoaded) {
            tray = (
                <Provider value={{ open }}>{children}</Provider>
            );
        }

        return (
        // This element should NOT show up as a valid element that can be clicked on.
        // It's sole purpose is to listen for these events coming from it's children.
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
                ref={this.mainRef}
                id={id}
                className={classnames('ra-drop-down', className, {
                    open,
                })}
                onKeyUp={this.handleKeyUp}
                onKeyPress={this.handleButtonKeyPress}
                onKeyDown={this.handleKeyDown}
                onBlur={this.handleBlur}
                onClick={onClick}
            >
                {this.renderMainControl()}
                <Tray
                    className={classnames('ra-drop-down-tray', trayClassName)}
                    ref={this.trayRef}
                    open={open || openFromHover || openFromFocus}
                    id={!isNil(id) && id.length > 0 ? `${id}-tray` : undefined}
                    dropPositions={dropPositions}
                    getAnchor={this.getAnchor}
                    onClick={this.handleTrayClick}
                    minWidth={minTrayWidth}
                    maxWidth={maxTrayWidth}
                    maxHeight={maxTrayHeight}
                    horizontallyCenter={horizontallyCenter}
                    dockRight={dockRight}
                    enableTail={enableTail}
                >
                    {tray}
                </Tray>
            </div>
        );
    }
}

export default DropDown;
