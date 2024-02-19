/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import noop from 'lodash/noop';
import IconBox from '../../../display/icon-box/index';
import IconButton from '../../../display/icon-button/index';
import changeSize from '../../../../util/change-size';
import PropTypes from '../../../../common/prop-types';

class BaseCursorInput extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string,
        className: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        onClear: PropTypes.func,
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
        leftIcon: PropTypes.shape({
            icon: PropTypes.icon.isRequired,
            onClick: PropTypes.func,
        }),
        rightIcon: PropTypes.shape({
            icon: PropTypes.icon.isRequired,
            onClick: PropTypes.func,
            overrideClear: PropTypes.bool,
        }),
        children: PropTypes.func.isRequired,
        hideClearButton: PropTypes.bool,
    };

    static defaultProps = {
        id: null,
        className: null,
        value: null,
        disabled: false,
        onClear: null,
        leftIcon: null,
        rightIcon: null,
        hideClearButton: false,
        size: 'md',
        onChange: noop,
    };

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);

        const { value } = props;

        this.state = {
            value,
            nextValue: value,
        };
    }

    static getDerivedStateFromProps(nextProps, currentState) {
        let { value } = nextProps;

        // If the new incoming value matches what we currently have
        // Then use what we have in nextValue in the state
        // It is possible that getDerivedStateFromProps is being called because the state changed
        // If that is true then "value === nextState.value" should also be true
        if (value === currentState.value) {
            // Which means we want to use what is coming in from the state
            value = currentState.nextValue;
        }
        // If on the other hand the incoming value from nextProps is different
        // then we have already set value to it and we will use that instead.

        // This might sounds weird but we are doing all this to try to maintain
        // the cursor position cleanly and efficiently.

        return {
            value,
            nextValue: value,
        };
    }

    handleChange(value) {
        const { onChange } = this.props;

        const { value: currentValue } = this.state;

        if (currentValue === value) {
            return;
        }

        this.setState({
            nextValue: value,
        });

        onChange(value);
    }

    handleClear() {
        const { onClear, onChange } = this.props;

        onChange(null);

        if (!isNil(onClear)) {
            onClear();
        }
    }

    // eslint-disable-next-line class-methods-use-this
    handleMouseDown(event) {
        event.preventDefault();
    }

    renderIcon(className, icon, onClick) {
        let { size } = this.props;

        size = changeSize(size, 1);

        if (!isNil(onClick)) {
            return (
                <IconButton
                    className={className}
                    icon={icon}
                    onClick={onClick}
                    size={size}
                    onMouseDown={(event) => {
                        event.preventDefault();
                    }}
                    tabIndex="-1"
                />
            );
        }

        return (
            <span className={className}>
                <IconBox icon={icon} size={size} />
            </span>
        );
    }

    renderLeftAnnotation() {
        const { leftIcon } = this.props;

        if (!isNil(leftIcon)) {
            return this.renderIcon(
                'left-annotation',
                leftIcon.icon,
                leftIcon.onClick,
            );
        }

        return null;
    }

    renderRightAnnotation() {
        const { rightIcon } = this.props;

        if (!isNil(rightIcon)) {
            return this.renderIcon(
                'right-annotation',
                rightIcon.icon,
                rightIcon.onClick,
            );
        }

        return null;
    }

    render() {
        const {
            id,
            disabled,
            size,
            className,
            children,
            hideClearButton,
            rightIcon,
        } = this.props;

        const { value } = this.state;

        const overrideClear = rightIcon?.overrideClear;

        let clearButton = null;

        if (!disabled && !isNil(value) && !hideClearButton && !overrideClear) {
            clearButton = (
                <IconButton
                    id={`${id}-clear`}
                    className="clear-button"
                    size={changeSize(size, 1)}
                    tabIndex="-1"
                    icon={faXmark}
                    onClick={this.handleClear}
                    onMouseDown={this.handleMouseDown}
                    aria-label="Clear"
                />
            );
        }

        const leftAnnotation = this.renderLeftAnnotation();
        const rightAnnotation = this.renderRightAnnotation();

        return (
            <div
                className={classnames('input-container', className, {
                    'has-left-annotation': !isNil(leftAnnotation),
                    'has-right-annotation': !isNil(rightAnnotation),
                    'has-clear-annotation': !isNil(clearButton),
                })}
            >
                {leftAnnotation}
                {children({
                    value,
                    onChange: this.handleChange,
                })}
                {clearButton}
                {rightAnnotation}
            </div>
        );
    }
}

export default BaseCursorInput;

const {
    children,
    hideClearButton,
    valueType,
    willChange,
    ...exportPropTypes
    // eslint-disable-next-line react/forbid-foreign-prop-types
} = BaseCursorInput.propTypes;

const exportDefaultProps = BaseCursorInput.defaultProps;

export { exportPropTypes as propTypes, exportDefaultProps as defaultProps };
