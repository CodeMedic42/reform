import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class ListItemContent extends PureComponent {
    getRootNode() {
        return this.buttonRef.current;
    }

    render() {
        const { id, className, children } = this.props;

        return (
            <span
                id={id}
                className={classnames('ra-dd-list-item-content', className)}
            >
                {children}
            </span>
        );
    }
}

ListItemContent.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
};

ListItemContent.defaultProps = {
    id: null,
    className: null,
    children: null,
};

export default ListItemContent;
