import React, { PureComponent, createRef } from 'react';
import classnames from 'classnames';
import DropDownListItem from '../drop-down/drop-down-list-item.mjs';
import '../../../common/prop-types.mjs';
import PropTypes from 'prop-types';

class MenuItem extends PureComponent {
    constructor(props) {
        super(props);
        this.itemRef = createRef();
    }
    getRootNode() {
        return this.itemRef.current.getRootNode();
    }
    render() {
        const { id, className, children, selected, targeted, onMouseEnter, onMouseLeave, borderBottom, borderTop, onClick, preventCloseOnClick, } = this.props;
        return (React.createElement(DropDownListItem, { ref: this.itemRef, id: id, className: classnames('ra-dd-menu-list-item', className), onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, selected: selected, targeted: targeted, borderBottom: borderBottom, borderTop: borderTop, onClick: onClick, preventCloseOnClick: preventCloseOnClick }, children));
    }
}
MenuItem.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    selected: PropTypes.bool,
    targeted: PropTypes.bool,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    borderBottom: PropTypes.bool,
    borderTop: PropTypes.bool,
    onClick: PropTypes.func,
    preventCloseOnClick: PropTypes.bool,
};
MenuItem.defaultProps = {
    id: null,
    className: null,
    children: null,
    selected: false,
    targeted: false,
    onMouseEnter: null,
    onMouseLeave: null,
    borderBottom: false,
    borderTop: false,
    onClick: null,
    preventCloseOnClick: false,
};

export { MenuItem as default };
