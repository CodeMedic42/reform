import React, { PureComponent } from 'react';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import ListItemContent from '../drop-down/list-item-content';
import IconButton from '../../icon-button';
import MenuItem from './menu-item';
import Icon from '../../display/icon';
import PropTypes from '../../../common/prop-types';

class MenuRemovable extends PureComponent {
    render() {
        const {
            id,
            className,
            children,
            selected,
            targeted,
            disabled,
            onRemove,
            onRemoveMeta,
            borderBottom,
            borderTop,
            icon,
        } = this.props;

        return (
            <MenuItem
                id={id}
                className={classnames('menu-removable', className)}
                selected={selected}
                targeted={targeted}
                borderBottom={borderBottom}
                borderTop={borderTop}
                preventCloseOnClick
            >
                <ListItemContent>
                    {!isNil(icon) ? (
                        <Icon className="menu-icon" icon={icon} />
                    ) : null}
                    {children}
                    <IconButton
                        className="menu-remove-btn"
                        icon={faXmark}
                        size="2xs"
                        disabled={disabled}
                        onClick={onRemove}
                        onClickMeta={onRemoveMeta}
                    />
                </ListItemContent>
            </MenuItem>
        );
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

export default MenuRemovable;
