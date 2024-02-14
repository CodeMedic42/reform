import React from 'react';
import classnames from 'classnames';
import PropTypes from '../../../common/prop-types';

function ScalingContainer(props) {
    const {
        id,
        className,
        children,
    } = props;

    return (
        <div
            id={id}
            className={classnames('ra-scaling-container', className)}
        >
            <div className="ra-scaling-content">
                {children}
            </div>
        </div>
    );
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

export default ScalingContainer;
