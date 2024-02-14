import React, { PureComponent } from 'react';
import isNil from 'lodash/isNil';
import ListItemContent from '../drop-down/list-item-content';
import Icon from '../../display/icon';
import PropTypes from '../../../common/prop-types';
import MenuItem from './menu-item';

class MenuText extends PureComponent {
    renderListItemContent() {
        const { children, menuIcon } = this.props;

        let content = children;

        if (!isNil(menuIcon)) {
            content = (
                <>
                    <Icon icon={menuIcon} />
                    {children}
                </>
            );
        }

        return content;
    }

    render() {
        const {
            id,
            className,
            selected,
            targeted,
            borderBottom,
            borderTop,
            icon,
        } = this.props;

        return (
            <MenuItem
                id={id}
                className={className}
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
                    {this.renderListItemContent()}
                </ListItemContent>
            </MenuItem>
        );
    }
}

MenuText.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    menuIcon: PropTypes.icon,
    children: PropTypes.string,
    selected: PropTypes.bool,
    targeted: PropTypes.bool,
    borderBottom: PropTypes.bool,
    borderTop: PropTypes.bool,
    icon: PropTypes.icon,
};

MenuText.defaultProps = {
    id: null,
    className: null,
    selected: false,
    targeted: false,
    menuIcon: null,
    children: null,
    borderBottom: false,
    borderTop: false,
    icon: null,
};

export default MenuText;
