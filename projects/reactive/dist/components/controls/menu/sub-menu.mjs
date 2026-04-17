import React, { PureComponent, createRef } from 'react';
import classnames from 'classnames';
import { isNil, isString, isArray, map, join } from 'lodash-es';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight';
import ListItemButton from '../drop-down/list-item-button.mjs';
import Tray from '../../arrangement/tray/tray.mjs';
import MenuList from './menu-list.mjs';
import Icon from '../../display/icon/icon.mjs';
import Provider, { ApplyConsumer } from '../drop-down/drop-down-context.mjs';
import '../../../common/prop-types.mjs';
import MenuItem from './menu-item.mjs';
import CheckInput from '../../fields/check-input-field/check-input-field.mjs';
import buildId from '../../../common/build-id.mjs';
import PropTypes from 'prop-types';

function preventDefault({ event }) {
    event.preventDefault();
}
function getString(content) {
    if (isString(content)) {
        return content;
    }
    const { children } = content.props;
    if (!isArray(children)) {
        return getString(children);
    }
    const text = map(children, getString);
    return join(text, ' ');
}
class SubMenu extends PureComponent {
    constructor(props) {
        super(props);
        this.itemRef = createRef();
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            open: false,
        };
    }
    // This will close the menu if it's parent is closed
    static getDerivedStateFromProps(nextProps) {
        const { dropDownContext: { open }, } = nextProps;
        if (!open) {
            return {
                open: false,
            };
        }
        return null;
    }
    handleMouseEnter() {
        this.setOpen(true);
    }
    handleMouseLeave() {
        this.setOpen(false);
    }
    handleClick({ event }) {
        const { children, onClick, onClickMeta } = this.props;
        const { open } = this.state;
        if (event.defaultPrevented) {
            return;
        }
        if (!isNil(children) && isNil(onClick)) {
            event.preventDefault();
            this.setOpen(!open);
        }
        if (!isNil(onClick)) {
            onClick({
                event,
                meta: onClickMeta,
            });
        }
    }
    setOpen(to) {
        const { children } = this.props;
        const { open } = this.state;
        if (open === to || isNil(children)) {
            return;
        }
        this.setState({
            open: to,
        });
    }
    isOpen() {
        const { open } = this.state;
        return open;
    }
    renderCheckBox() {
        const { id, checkbox, 'aria-label': ariaLabel, content, } = this.props;
        if (isNil(checkbox)) {
            return null;
        }
        return (React.createElement(CheckInput, { key: "check", id: buildId(id, 'check'), className: "menu-checkbox-control", color: "secondary", size: "sm", value: checkbox.value, onChange: checkbox.onChange, disabled: checkbox.disabled, onClick: preventDefault, variant: checkbox.variant, "aria-label": `${!isNil(ariaLabel) ? ariaLabel : content} Checkbox` }));
    }
    render() {
        const { id, className, children, selected, targeted, disabled, dropDownContext: { size, dark }, borderBottom, borderTop, checkbox, content, icon, 'aria-label': ariaLabel, } = this.props;
        const { open } = this.state;
        return (React.createElement(MenuItem, { id: id, className: classnames('sub-menu', 'menu-button', className, {
                'menu-checkbox': !isNil(checkbox),
            }), onMouseEnter: this.handleMouseEnter, onMouseLeave: this.handleMouseLeave, selected: selected, targeted: targeted, borderBottom: borderBottom, borderTop: borderTop },
            React.createElement(ListItemButton, { disabled: disabled, ref: this.itemRef, onClick: this.handleClick, "aria-label": !isNil(ariaLabel) ? ariaLabel : getString(content) },
                this.renderCheckBox(),
                !isNil(icon) ? (React.createElement(Icon, { className: "menu-icon", icon: icon })) : null,
                content,
                React.createElement(Icon, { className: "menu-arrow", icon: faCaretRight })),
            React.createElement(Provider, { value: { open, size, dark } },
                React.createElement(Tray, { id: !isNil(id) && id.length > 0 ? `${id}-drawer` : null, open: open, getAnchorElement: () => this.itemRef.current.getRootNode(), dropPositions: ['right', 'left', 'bottom', 'top'], offset: {
                        top: -8,
                        bottom: -8,
                    }, maxWidth: 320 },
                    React.createElement(MenuList, { size: size, dark: dark }, children)))));
    }
}
SubMenu.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.icon,
    content: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    onClick: PropTypes.func,
    'aria-label': PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    onClickMeta: PropTypes.any,
    selected: PropTypes.bool,
    targeted: PropTypes.bool,
    disabled: PropTypes.bool,
    dropDownContext: PropTypes.shape({
        open: PropTypes.bool.isRequired,
        size: PropTypes.string.isRequired,
        dark: PropTypes.bool.isRequired,
    }).isRequired,
    borderBottom: PropTypes.bool,
    borderTop: PropTypes.bool,
    checkbox: PropTypes.shape({
        onChange: PropTypes.func.isRequired,
        value: PropTypes.bool,
        disabled: PropTypes.bool,
        variant: PropTypes.oneOf(['check', 'indeterminate']),
    }),
};
SubMenu.defaultProps = {
    id: null,
    className: null,
    children: null,
    onClick: null,
    onClickMeta: null,
    selected: false,
    targeted: false,
    disabled: false,
    icon: null,
    content: null,
    borderBottom: false,
    borderTop: false,
    checkbox: null,
    'aria-label': null,
};
var subMenu = ApplyConsumer(SubMenu);

export { subMenu as default };
