import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import ListItemContent from '../drop-down/list-item-content.js';
import IconButton from '../../display/icon-button/index.js';
import MenuItem from './menu-item.js';
import Icon from '../../display/icon/index.js';
import PropTypes from '../../../common/prop-types.js';

class MenuRemovable extends PureComponent {
    static propTypes = {
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

    static defaultProps = {
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

export default MenuRemovable;
