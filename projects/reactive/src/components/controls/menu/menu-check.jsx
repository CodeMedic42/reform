import React, { createRef, PureComponent } from 'react';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import PropTypes from '../../../common/prop-types';
import CheckInput from '../../inputs/check-input';
import MenuItem from './menu-item';
import buildId from '../../../common/build-id';
import ListItemContent from '../drop-down/list-item-content';
import Icon from '../../display/icon';

class MenuCheck extends PureComponent {
    constructor(props) {
        super(props);

        this.itemRef = createRef();
    }

    getRootNode() {
        return this.itemRef.current.getRootNode();
    }

    render() {
        const {
            id,
            className,
            children,
            borderBottom,
            borderTop,
            value,
            onChange,
            disabled,
            variant,
            icon,
            'aria-label': ariaLabel,
        } = this.props;

        return (
            <MenuItem
                id={id}
                className={classnames('menu-checkbox', className)}
                borderBottom={borderBottom}
                borderTop={borderTop}
                preventCloseOnClick
            >
                <ListItemContent>
                    <CheckInput
                        id={buildId(id, 'check')}
                        className="menu-checkbox-control"
                        color="secondary"
                        size="sm"
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        variant={variant}
                        aria-label={`${
                            !isNil(ariaLabel) ? ariaLabel : children
                        } Checkbox`}
                    />
                    {!isNil(icon) ? (
                        <Icon className="menu-icon" icon={icon} />
                    ) : null}
                    {children}
                </ListItemContent>
            </MenuItem>
        );
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

export default MenuCheck;
