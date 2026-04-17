import React, { PureComponent } from 'react';
import { isNil } from 'lodash-es';
import ListItemContent from '../drop-down/list-item-content.mjs';
import Icon from '../../display/icon/icon.mjs';
import '../../../common/prop-types.mjs';
import MenuItem from './menu-item.mjs';
import PropTypes from 'prop-types';

class MenuText extends PureComponent {
    renderListItemContent() {
        const { children, menuIcon } = this.props;
        let content = children;
        if (!isNil(menuIcon)) {
            content = (React.createElement(React.Fragment, null,
                React.createElement(Icon, { icon: menuIcon }),
                children));
        }
        return content;
    }
    render() {
        const { id, className, selected, targeted, borderBottom, borderTop, icon, } = this.props;
        return (React.createElement(MenuItem, { id: id, className: className, selected: selected, targeted: targeted, borderBottom: borderBottom, borderTop: borderTop, preventCloseOnClick: true },
            React.createElement(ListItemContent, null,
                !isNil(icon) ? (React.createElement(Icon, { className: "menu-icon", icon: icon })) : null,
                this.renderListItemContent())));
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

export { MenuText as default };
