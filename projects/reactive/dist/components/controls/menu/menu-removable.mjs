import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import ListItemContent from '../drop-down/list-item-content.mjs';
import IconButton from '../../display/icon-button/icon-button.mjs';
import MenuItem from './menu-item.mjs';
import Icon from '../../display/icon/icon.mjs';
import '../../../common/prop-types.mjs';
import PropTypes from 'prop-types';

class MenuRemovable extends PureComponent {
    render() {
        const { id, className, children, selected, targeted, disabled, onRemove, onRemoveMeta, borderBottom, borderTop, icon, } = this.props;
        return (React.createElement(MenuItem, { id: id, className: classnames('menu-removable', className), selected: selected, targeted: targeted, borderBottom: borderBottom, borderTop: borderTop, preventCloseOnClick: true },
            React.createElement(ListItemContent, null,
                !isNil(icon) ? (React.createElement(Icon, { className: "menu-icon", icon: icon })) : null,
                children,
                React.createElement(IconButton, { className: "menu-remove-btn", icon: faXmark, size: "2xs", disabled: disabled, onClick: onRemove, onClickMeta: onRemoveMeta }))));
    }
}
MenuRemovable.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.string,
    onRemove: PropTypes.func,
    // eslint-disable-next-line react/forbid-prop-types
    onRemoveMeta: PropTypes.any,
    selected: PropTypes.bool,
    targeted: PropTypes.bool,
    disabled: PropTypes.bool,
    borderBottom: PropTypes.bool,
    borderTop: PropTypes.bool,
    icon: PropTypes.icon,
};
MenuRemovable.defaultProps = {
    id: null,
    className: null,
    onRemove: null,
    onRemoveMeta: null,
    selected: false,
    targeted: false,
    disabled: false,
    children: null,
    borderBottom: false,
    borderTop: false,
    icon: null,
};

export { MenuRemovable as default };
