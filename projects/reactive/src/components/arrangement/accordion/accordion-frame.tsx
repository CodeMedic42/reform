import React from 'react';
import classNames from 'classnames';
import { isNil } from 'lodash-es';

interface AccordionFrameProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
    heading?: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
    // Injected by parent Accordion via cloneElement — not part of the public API.
    expanded?: boolean;
    flexGrow?: number;
    onToggle?: () => void;
    onResizeStart?: (e: React.PointerEvent<HTMLDivElement>) => void;
}

function AccordionFrame(props: AccordionFrameProps) {
    const {
        className,
        children,
        heading,
        style: userStyle,
        expanded,
        flexGrow,
        onToggle,
        onResizeStart,
        ...rest
    } = props;

    const style = !isNil(flexGrow) ? { ...userStyle, flexGrow: flexGrow } : userStyle;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle?.();
        }
    };

    return (
        <div
            className={classNames(
                'ra-accordion-frame',
                { 'expanded': expanded },
                className,
            )}
            style={style}
            {...rest}
        >
            {!isNil(onResizeStart) && (
                <div
                    className="ra-accordion-frame-resizer"
                    onPointerDown={onResizeStart}
                />
            )}
            <div
                className="ra-accordion-frame-header"
                role="button"
                tabIndex={0}
                aria-expanded={!!expanded}
                onClick={onToggle}
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
