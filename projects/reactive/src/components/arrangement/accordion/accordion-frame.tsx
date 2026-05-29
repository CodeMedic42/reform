import React from 'react';
import classNames from 'classnames';
import { isNil } from 'lodash-es';

type AccordionDirection = 'horizontal' | 'vertical';

interface AccordionFrameProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
    heading?: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
    // Injected by parent Accordion via cloneElement — not part of the public API.
    _expanded?: boolean;
    _direction?: AccordionDirection;
    _flexGrow?: number;
    _onToggle?: () => void;
    _onResizeStart?: (e: React.PointerEvent<HTMLDivElement>) => void;
}

function AccordionFrame(props: AccordionFrameProps) {
    const {
        className,
        children,
        heading,
        style: userStyle,
        _expanded,
        _direction: _ignoredDirection,
        _flexGrow,
        _onToggle,
        _onResizeStart,
        ...rest
    } = props;

    const style = !isNil(_flexGrow) ? { ...userStyle, flexGrow: _flexGrow } : userStyle;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            _onToggle?.();
        }
    };

    return (
        <div
            className={classNames(
                'ra-accordion-frame',
                { 'ra-accordion-frame--expanded': _expanded },
                className,
            )}
            style={style}
            {...rest}
        >
            {!isNil(_onResizeStart) && (
                <div
                    className="ra-accordion-frame-resizer"
                    onPointerDown={_onResizeStart}
                />
            )}
            <div
                className="ra-accordion-frame-header"
                role="button"
                tabIndex={0}
                aria-expanded={!!_expanded}
                onClick={_onToggle}
                onKeyDown={handleKeyDown}
            >
                {heading}
            </div>
            <div className="ra-accordion-frame-content">
                <div className="ra-accordion-frame-content-inner">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AccordionFrame;
