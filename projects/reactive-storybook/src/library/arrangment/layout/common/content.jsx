import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

function Content(props) {
    const {
        shrink, style, children, Component = 'div',
    } = props;

    return (
        <Component
            className={classnames('column-content', { shrink })}
            style={style}
        >
            {children}
        </Component>
    );
}

Content.propTypes = {
    shrink: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    style: PropTypes.object,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    Component: PropTypes.string,
};

Content.defaultProps = {
    shrink: false,
    children: null,
    style: null,
    Component: 'div',
};

export default Content;
