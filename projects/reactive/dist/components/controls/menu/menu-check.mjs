import React, { PureComponent, createRef } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import '../../../common/prop-types.mjs';
import CheckInput from '../../fields/check-input-field/check-input-field.mjs';
import MenuItem from './menu-item.mjs';
import buildId from '../../../common/build-id.mjs';
import ListItemContent from '../drop-down/list-item-content.mjs';
import Icon from '../../display/icon/icon.mjs';
import PropTypes from 'prop-types';

class MenuCheck extends PureComponent {
    constructor(props) {
        super(props);
        this.itemRef = createRef();
    }
    getRootNode() {
        return this.itemRef.current.getRootNode();
    }
    render() {
        const { id, className, children, borderBottom, borderTop, value, onChange, disabled, variant, icon, 'aria-label': ariaLabel, } = this.props;
        return (React.createElement(MenuItem, { id: id, className: classnames('menu-checkbox', className), borderBottom: borderBottom, borderTop: borderTop, preventCloseOnClick: true },
            React.createElement(ListItemContent, null,
                React.createElement(CheckInput, { id: buildId(id, 'check'), className: "menu-checkbox-control", color: "secondary", size: "sm", value: value, onChange: onChange, disabled: disabled, variant: variant, "aria-label": `${!isNil(ariaLabel) ? ariaLabel : children} Checkbox` }),
                !isNil(icon) ? (React.createElement(Icon, { className: "menu-icon", icon: icon })) : null,
                children)));
    }
}
MenuCheck.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.string,
    borderBottom: PropTypes.bool,
    borderTop: PropTypes.bool,
    value: PropTypes.bool,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    variant: PropTypes.oneOf(['check', 'indeterminate']),
    icon: PropTypes.icon,
    'aria-label': PropTypes.string,
};
MenuCheck.defaultProps = {
    id: null,
    className: null,
    children: null,
    borderBottom: false,
    borderTop: false,
    value: false,
    onChange: null,
    disabled: false,
    variant: null,
    icon: null,
    'aria-label': null,
};

export { MenuCheck as default };
