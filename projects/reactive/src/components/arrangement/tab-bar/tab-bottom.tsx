import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

function TabBottom(props) {
    const {
        id,
        className,
        children,
    } = props;

    return (
        <div id={id} className={classnames('ra-tab-bottom', className)}>
            {children}
        </div>
    );
}

TabBottom.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
};

TabBottom.defaultProps = {
    id: null,
    className: null,
    children: null,
};

export default TabBottom;
