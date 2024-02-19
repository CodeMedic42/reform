/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import DropDownList from '../drop-down/drop-down-list';

class MenuList extends PureComponent {
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

    constructor(...args) {
        super(...args);

        this.listRef = createRef();
    }

    getRootNode() {
        return this.listRef.current.getRootNode();
    }

    render() {
        const { className, children, ...rest } = this.props;

        return (
            <DropDownList
                {...rest}
                ref={this.listRef}
                className={classnames('ra-menu-list', className)}
            >
                {children}
            </DropDownList>
        );
    }
}

export default MenuList;
