/* @typescript-eslint/no-unused-vars */
import React from 'react';
import classnames from 'classnames';
import { isNil, noop } from 'lodash-es';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import IconBox from '../../../display/icon-box/index.jsx';
import IconButton from '../../../display/icon-button/index.jsx';
import changeSize from '../../../../util/change-size.js';

interface IconConfig {
    icon: unknown;
    onClick?: (() => void) | null;
}

interface RightIconConfig extends IconConfig {
    overrideClear?: boolean;
}

interface BaseCursorInputProps {
    id?: string | null;
    className?: string | null;
    value?: string | number | null;
    disabled?: boolean;
    onChange?: ((value: string | null) => void);
    onClear?: (() => void) | null;
    size?: 'sm' | 'md' | 'lg';
    leftIcon?: IconConfig | null;
    rightIcon?: RightIconConfig | null;
    children: (args: { value: string | number | null; onChange: (value: string | null) => void }) => React.ReactNode;
    hideClearButton?: boolean;
}

interface BaseCursorInputState {
    value: string | number | null;
    nextValue: string | number | null;
}

class BaseCursorInput extends React.PureComponent<BaseCursorInputProps, BaseCursorInputState> {
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

    constructor(props: BaseCursorInputProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);

        const { value } = props;

        this.state = {
            value: value ?? null,
            nextValue: value ?? null,
        };
    }

    static getDerivedStateFromProps(nextProps: BaseCursorInputProps, currentState: BaseCursorInputState) {
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

    handleChange(value: string | null) {
        const { onChange } = this.props;

        const { value: currentValue } = this.state;

        if (currentValue === value) {
            return;
        }

        this.setState({
            nextValue: value,
        });

        if (onChange) {
            onChange(value);
        }
    }

    handleClear() {
        const { onClear, onChange } = this.props;

        if (onChange) {
            onChange(null);
        }

        if (!isNil(onClear)) {
            onClear();
        }
    }

    handleMouseDown(event: React.MouseEvent) {
        event.preventDefault();
    }

    renderIcon(className: string, icon: unknown, onClick?: (() => void) | null) {
        const { size } = this.props;

        const iconSize = changeSize(size ?? 'md', 1) as '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

        if (!isNil(onClick)) {
            return (
                <IconButton
                    className={className}
                    icon={icon as IconProp}
                    onClick={onClick}
                    size={iconSize}
                    onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
                        event.preventDefault();
                    }}
                    tabIndex="-1"
                />
            );
        }

        return (
            <span className={className}>
                <IconBox icon={icon as IconProp} size={iconSize} />
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

        let clearButton: React.ReactNode = null;

        if (!disabled && !isNil(value) && !hideClearButton && !overrideClear) {
            clearButton = (
                <IconButton
                    id={`${id}-clear`}
                    className="clear-button"
                    size={changeSize(size ?? 'md', 1) as '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'}
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
