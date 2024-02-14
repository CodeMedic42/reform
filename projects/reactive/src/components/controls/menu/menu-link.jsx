import React, { PureComponent } from 'react';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import ListItemLink from '../drop-down/list-item-link';
import Icon from '../../display/icon';
import PropTypes from '../../../common/prop-types';
import MenuItem from './menu-item';

class MenuLink extends PureComponent {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick({ event }) {
        const { onClick, onClickMeta } = this.props;

        if (event.defaultPrevented) {
            return;
        }

        if (!isNil(onClick)) {
            onClick({
                event,
                meta: onClickMeta,
            });
        }
    }

    render() {
        const {
            id,
            className,
            selected,
            targeted,
            disabled,
            href,
            borderBottom,
            borderTop,
            icon,
            'aria-label': ariaLabel,
            children,
        } = this.props;

        return (
            <MenuItem
                id={id}
                className={classnames('menu-link', className)}
                selected={selected}
                targeted={targeted}
                borderBottom={borderBottom}
                borderTop={borderTop}
            >
                <ListItemLink
                    disabled={disabled}
                    onClick={this.handleClick}
                    href={href}
                    aria-label={!isNil(ariaLabel) ? ariaLabel : children}
                >
                    {!isNil(icon) ? (
                        <Icon className="menu-icon" icon={icon} />
                    ) : null}
                    {children}
                </ListItemLink>
            </MenuItem>
        );
    }
}

MenuLink.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.icon,
    children: PropTypes.string,
    onClick: PropTypes.func,
    'aria-label': PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    onClickMeta: PropTypes.any,
    selected: PropTypes.bool,
    targeted: PropTypes.bool,
    disabled: PropTypes.bool,
    href: PropTypes.string,
    borderBottom: PropTypes.bool,
    borderTop: PropTypes.bool,
};

MenuLink.defaultProps = {
    id: null,
    className: null,
    onClick: null,
    onClickMeta: null,
    selected: false,
    targeted: false,
    disabled: false,
    icon: null,
    children: null,
    href: null,
    borderBottom: false,
    borderTop: false,
    'aria-label': null,
};

export default MenuLink;
