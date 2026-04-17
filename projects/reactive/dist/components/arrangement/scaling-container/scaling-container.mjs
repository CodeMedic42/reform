import React from 'react';
import classnames from 'classnames';
import '../../../common/prop-types.mjs';
import PropTypes from 'prop-types';

function ScalingContainer(props) {
    const { id, className, children, } = props;
    return (React.createElement("div", { id: id, className: classnames('ra-scaling-container', className) },
        React.createElement("div", { className: "ra-scaling-content" }, children)));
}
ScalingContainer.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.children,
};
ScalingContainer.defaultProps = {
    id: null,
    className: null,
    children: null,
};

export { ScalingContainer as default };
