import React from "react";
import classnames from "classnames";

export interface StickyContainerProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'style'> {
    style?: React.CSSProperties & {
        '--sticky-gutter-width'?: string;
    };
}

function StickyContainer(props: StickyContainerProps) {
    const { 
        id,
        children,
        className,
        ...rest
    } = props;  

    return (
        <div
            id={id}
            className={classnames('ra-sticky-container', className)}
            {...rest}
        >
            <div className="ra-sticky-container-left-gutter" />
            <div className="ra-sticky-container-inner">
                {children}
            </div>
            <div className="ra-sticky-container-right-gutter" />
        </div>
    );
}

export default StickyContainer;