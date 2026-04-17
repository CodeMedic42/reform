import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class ListItemContent extends PureComponent {
    static propTypes = {
        id: PropTypes.string,
        className: PropTypes.string,
        children: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.arrayOf(PropTypes.node),
        ]),
    };

    static defaultProps = {
        id: null,
        className: null,
        children: null,
    };

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

export default ListItemContent;
