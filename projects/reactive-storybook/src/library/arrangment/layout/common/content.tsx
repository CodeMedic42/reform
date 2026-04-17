import React from 'react';
import classnames from 'classnames';

interface ContentProps {
    shrink?: boolean;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    Component?: keyof React.JSX.IntrinsicElements;
}

function Content({
    shrink = false,
    style,
    children,
    Component = 'div',
}: ContentProps) {
    return (
        <Component
            className={classnames('column-content', { shrink })}
            style={style}
        >
            {children}
        </Component>
    );
}

export default Content;
