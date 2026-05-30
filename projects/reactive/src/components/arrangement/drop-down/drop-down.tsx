import React, { Component, createRef } from 'react';
import classnames from 'classnames';
import { isNil, get, debounce } from 'lodash-es';
import Tray from '../../arrangement/tray/index.js';
import Provider from './drop-down-context.js';

type DropPosition = 'top' | 'bottom' | 'left' | 'right';

interface DropDownProps {
    id?: string | null;
    className?: string | null;
    trayClassName?: string | null;
    children?: React.ReactNode;
    onBlur?: ((event: React.FocusEvent) => void);
    onFocus?: ((event: React.FocusEvent) => void);
    disabled?: boolean;
    dropPositions?: DropPosition[];
    closeTrayOnClick?: boolean;
    closeTrayOnEnter?: boolean;
    minTrayWidth?: number | 'anchor' | null;
    maxTrayWidth?: number | 'anchor' | null;
    maxTrayHeight?: number | null;
    onOpen?: (() => void) | null;
    onClose?: (() => void) | null;
    onKeyDown?: ((event: React.KeyboardEvent) => void) | null;
    Anchor: React.ElementType;
    anchorProps?: Record<string, unknown>;
    openOnHover?: boolean;
    hoverOpenTime?: number;
    autoCloseTime?: number | null;
    openOnFocus?: boolean;
    onAnchorClick?: ((event: React.MouseEvent) => void);
    openOnClick?: boolean;
    horizontallyCenter?: boolean;
    dockRight?: boolean;
    enableTail?: boolean;
    onClick?: ((event: React.MouseEvent) => void) | null;
    onOpened?: (() => void) | null;
    onClosed?: (() => void) | null;
    keepLoaded?: boolean;
}

interface DropDownState {
    open: boolean;
    openFromHover: boolean;
    openFromFocus: boolean;
}

const DEFAULTS = {
    openOnClick: true,
};

class DropDown extends Component<DropDownProps, DropDownState> {
    private openRef: React.RefObject<boolean>;

    private mainRef: React.RefObject<HTMLDivElement>;

    private anchorRef: React.RefObject<unknown>;

    private trayRef: React.RefObject<unknown>;

    private openFromHoverTimer: ReturnType<typeof setTimeout> | null;

    private autoCloseTimer: ReturnType<typeof setTimeout> | null;

    private controlTimer: ReturnType<typeof setTimeout> | null;

    private keyOnce: boolean;

    private handleButtonKeyPress: (event: React.KeyboardEvent) => void;

    private handleButtonClick: (event: React.MouseEvent) => void;

    private handleTrayClick: (event: React.MouseEvent) => void;

    private handleWindowEvent: ReturnType<typeof debounce>;

    private handleButtonFocus: (event: React.FocusEvent) => void;

    private handleBlur: (event: React.FocusEvent) => void;

    private handleKeyUp: () => void;

    declare setOpen: (open: boolean) => void;

    private handleKeyDown: (event: React.KeyboardEvent) => void;

    private handleAnchorPointerEnter: () => void;

    private handleAnchorPointerLeave: () => void;

    constructor(props: DropDownProps) {
        super(props);

        this.openRef = createRef();

        (this.openRef as React.MutableRefObject<boolean>).current = false;

        this.mainRef = createRef();

        this.anchorRef = createRef();

        this.trayRef = createRef();

        this.openFromHoverTimer = null;

        this.autoCloseTimer = null;

        this.controlTimer = null;

        this.keyOnce = false;

        this.handleButtonKeyPress = this._handleButtonKeyPress.bind(this);
        this.handleButtonClick = this._handleButtonClick.bind(this);
        this.handleTrayClick = this._handleTrayClick.bind(this);
        this.handleWindowEvent = debounce(
            this._handleWindowEvent.bind(this),
            200,
            {
                leading: true,
                trailing: false,
            },
        );
        // this.handleWindowKeyDown = this.handleWindowKeyDown.bind(this);
        this.handleButtonFocus = this._handleButtonFocus.bind(this);
        this.handleBlur = this._handleBlur.bind(this);
        this.handleKeyUp = this._handleKeyUp.bind(this);
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
        this.setOpen = debounce(this._setOpen.bind(this), 200, {
            leading: true,
            trailing: false,
        });
        this.focus = this.focus.bind(this);
        this.getAnchor = this.getAnchor.bind(this);
        this.handleKeyDown = this._handleKeyDown.bind(this);
        this.handleAnchorPointerEnter = this._handleAnchorPointerEnter.bind(this);
        this.handleAnchorPointerLeave = this._handleAnchorPointerLeave.bind(this);

        this.state = {
            open: false,
            openFromHover: false,
            openFromFocus: false,
        };
    }

    componentDidMount(): void {
        window.addEventListener('scroll', this.handleWindowEvent as unknown as EventListener, true);
        window.addEventListener('resize', this.handleWindowEvent as unknown as EventListener);
    }

    componentDidUpdate(): void {
        const {
            onOpened,
            onClosed,
        } = this.props;

        const {
            open
        } = this.state;

        if ((this.openRef as React.MutableRefObject<boolean>).current !== open) {
            if (open) {
                if (!isNil(onOpened)) {
                    onOpened();
                }
            } else if (!isNil(onClosed)) {
                onClosed();
            }

            (this.openRef as React.MutableRefObject<boolean>).current = open;
        }
    }

    componentWillUnmount(): void {
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

        window.removeEventListener('scroll', this.handleWindowEvent as unknown as EventListener, true);
        window.removeEventListener('resize', this.handleWindowEvent as unknown as EventListener);
    }

    getRootNode(): HTMLDivElement | null {
        return this.mainRef.current;
    }

    getAnchor(): HTMLElement | null {
        const anchorCurrent = (this.anchorRef as React.RefObject<{ getBoundingElement: () => HTMLElement }>).current;
        if (isNil(anchorCurrent)) {
            return null;
        }

        return anchorCurrent.getBoundingElement();
    }

    _handleButtonKeyPress(event: React.KeyboardEvent): void {
        const { openOnClick = DEFAULTS.openOnClick } = this.props;

        if (openOnClick && event.which === 13) {
            // enter key
            event.preventDefault();
        }
    }

    _handleButtonClick(event: React.MouseEvent): void {
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

    _handleTrayClick(event: React.MouseEvent): void {
        const { closeTrayOnClick } = this.props;

        if (closeTrayOnClick && !event.defaultPrevented) {
            this.setOpen(false);

            this.focusOnAnchorContent();
        }
    }

    _handleKeyUp(): void {
        this.keyOnce = false;
    }

    _handleKeyDown(event: React.KeyboardEvent): void {
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

    _handleButtonFocus(event: React.FocusEvent): void {
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

    _handleBlur(event: React.FocusEvent): void {
        const { currentTarget, relatedTarget } = event;

        if (
            (!isNil((this.trayRef as React.RefObject<HTMLElement>).current)
            && (this.trayRef as React.RefObject<HTMLElement>).current!.contains(relatedTarget))
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

    _handleAnchorPointerEnter(): void {
        const { hoverOpenTime, openOnHover, disabled } = this.props;

        if (disabled || !openOnHover) {
            return;
        }

        this.openFromHoverTimer = setTimeout(() => {
            this.setState({ openFromHover: true });

            this.openFromHoverTimer = null;
        }, hoverOpenTime);
    }

    _handleAnchorPointerLeave(): void {
        const { openFromHover } = this.state;

        if (!isNil(this.openFromHoverTimer)) {
            clearTimeout(this.openFromHoverTimer);

            this.openFromHoverTimer = null;
        }

        if (openFromHover) {
            this.setState({ openFromHover: false });
        }
    }

    _handleWindowEvent(event: Event): void {
        const { open } = this.state;

        if (!open) {
            return;
        }

        const eventTarget = event.target as Node;

        if (
            eventTarget.nodeType === 1
            && !isNil((this.trayRef as React.RefObject<HTMLElement>).current)
            && (this.trayRef as React.RefObject<HTMLElement>).current!.contains(eventTarget)
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

    _setOpen(open: boolean): void {
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

    focusOnAnchorContent(): void {
        const focus = get(this.anchorRef, ['current', 'focus']);

        if (isNil(focus)) {
            return;
        }

        focus();
    }

    focus(): void {
        const { disabled } = this.props;

        if (disabled) {
            return;
        }

        if (isNil(this.anchorRef) || isNil((this.anchorRef as React.RefObject<unknown>).current)) {
            console.warn('Attempting to focus on an unmounted component');
        }

        this.focusOnAnchorContent();

        // TODO: This was commented out at while tests were being written
        // If the tray should open of focus then that should be on the focus handler
        // which should be called because of this action.
        // This statement should be verified.
        // this.setOpen(true);
    }

    isOpen(): boolean {
        const { open } = this.state;

        return open;
    }

    close(focusOnAnchor?: boolean): void {
        this.setOpen(false);

        if (focusOnAnchor) {
            this.focusOnAnchorContent();
        }
    }

    open(): void {
        this.setOpen(true);
    }

    renderMainControl(): React.ReactNode {
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

    render(): React.ReactNode {
        const {
            id,
            className,
            trayClassName,
            children,
            dropPositions = ['bottom', 'top', 'right', 'left'],
            minTrayWidth = null,
            maxTrayWidth = null,
            maxTrayHeight = null,
            horizontallyCenter = false,
            dockRight = false,
            enableTail = false,
            onClick = null,
            keepLoaded = false,
        } = this.props;

        const { open, openFromHover, openFromFocus } = this.state;

        let tray: React.ReactNode = null;

        if (open || keepLoaded) {
            tray = (
                <Provider value={{ open }}>{children}</Provider>
            );
        }

        return (
        // This element should NOT show up as a valid element that can be clicked on.
        // It's sole purpose is to listen for these events coming from it's children.
            <div
                ref={this.mainRef}
                id={id ?? undefined}
                className={classnames('ra-drop-down', className, {
                    open,
                })}
                onKeyUp={this.handleKeyUp}
                onKeyPress={this.handleButtonKeyPress}
                onKeyDown={this.handleKeyDown}
                onBlur={this.handleBlur}
                onClick={onClick ?? undefined}
            >
                {this.renderMainControl()}
                <Tray
                    className={classnames('ra-drop-down-tray', trayClassName)}
                    ref={this.trayRef as React.RefObject<Tray>}
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
