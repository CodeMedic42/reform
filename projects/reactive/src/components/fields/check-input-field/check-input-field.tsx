/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { PureComponent, createRef } from 'react';
import classnames from 'classnames';
import { isNil, isEmpty } from 'lodash-es';
import { Color } from '../../../common/color-list.js';
import InputMessages from '../input-field-messages/index.js';
import buildLabeledControlProps from '../../../common/build-labeled-control-props.js';

interface InputMessagesData {
    general?: string[];
    success?: string[];
    failure?: string[];
}

interface CheckInputProps {
    id?: string | null;
    className?: string | null;
    label?: string | null;
    messages?: InputMessagesData | null;
    'aria-label'?: string | null;
    'aria-labelledby'?: string | null;
    'aria-describedby'?: string | null;
    title?: string | null;
    color?: Color;
    variant?: 'check' | 'indeterminate';
    value?: boolean;
    size?: 'sm' | 'md' | 'lg';
    onChange?: ((checked: boolean, meta: { event: React.ChangeEvent<HTMLInputElement>; meta: unknown }) => void) | null;
    onChangeMeta?: unknown;
    onClick?: ((meta: { event: React.MouseEvent; meta: unknown }) => void) | null;
    onClickMeta?: unknown;
    disabled?: boolean;
    hidden?: boolean;
    ignoreHalo?: boolean;
    constrictField?: boolean;
}

interface CheckInputState {
    inputId: string;
    labelId: string;
    descriptionId: string | null;
    labelledBy: string | null;
    describedBy: string | null;
    ariaLabel: string | null;
}

class CheckInput extends PureComponent<CheckInputProps, CheckInputState> {
    static defaultProps = {
        id: null,
        className: null,
        value: false,
        variant: 'check',
        label: null,
        messages: null,
        'aria-label': null,
        'aria-labelledby': null,
        'aria-describedby': null,
        title: null,
        color: 'primary',
        size: 'md',
        onChange: null,
        onChangeMeta: null,
        onClick: null,
        onClickMeta: null,
        disabled: false,
        hidden: false,
        ignoreHalo: false,
        constrictField: false,
    };

    inputRef: React.RefObject<HTMLInputElement>;

    constructor(props: CheckInputProps) {
        super(props);

        this.inputRef = createRef<HTMLInputElement>();

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);

        this.state = {} as CheckInputState;
    }

    static getDerivedStateFromProps(nextProps: CheckInputProps) {
        return buildLabeledControlProps(nextProps);
    }

    componentDidMount() {
        this.setCheckedAttribute();
    }

    componentDidUpdate() {
        this.setCheckedAttribute();
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { onChange, onChangeMeta } = this.props;

        if (isNil(onChange)) {
            return;
        }

        onChange(event.target.checked === true, {
            event,
            meta: onChangeMeta,
        });
    }

    handleClick(event: React.MouseEvent) {
        const { onClick, onClickMeta } = this.props;

        if (isNil(onClick)) {
            return;
        }

        onClick({
            event,
            meta: onClickMeta,
        });
    }

    setCheckedAttribute() {
        // This exists because there is a weird quirk in browsers that if the
        // click event default is prevented then EVEN IF the checkbox checked attribute
        // is set to true manually, it STILL does not get checked. For some reason
        // browsers do not use the onChange event for handling checkboxes,
        // but instead use the onClick event handler. The end result is if
        // you preventDefault() on the click event for the checkbox ANYWHERE
        // in the bubble scope, it effectively cancels setting the checked
        // attribute, EVEN if you do it manually.

        // preventDefault is used in many areas, in this library, to prevent
        // internal functionality where passing callbacks is extremely prohibitive
        // or the use of React Contexts would balloon out of control.

        // React decided to model after what the browsers do or they are
        // somehow bound to it. The explanations I found online were not
        // that great. However what I did find was most people just suggesting
        // to set the value outside of the callstack using setTimeout.

        // Works like a charm.
        setTimeout(() => {
            const { value } = this.props;

            const checkInput = this.inputRef.current;

            if (isNil(checkInput)) {
                return;
            }

            if (checkInput.checked !== (value === true)) {
                checkInput.checked = value === true;
            }
        }, 1);
    }

    render() {
        const {
            label,
            title,
            className,
            disabled,
            hidden,
            messages,
            color,
            size,
            variant,
            ignoreHalo,
            constrictField,
        } = this.props;

        const {
            inputId,
            labelId,
            descriptionId,
            labelledBy,
            describedBy,
            ariaLabel,
        } = this.state;

        let labelContentElement: React.ReactNode = null;
        let LabelElement: React.ElementType = 'span';

        if (!isEmpty(label)) {
            labelContentElement = (
                <span className="label-content">{label}</span>
            );
            LabelElement = 'label';
        }

        const variantClass = !isNil(variant)
            ? `variant-${variant}`
            : 'variant-check';

        return (
            <span
                className={classnames(
                    'ra-checkbox',
                    `size-${size}`,
                    variantClass,
                    `sch-check-${color}`,
                    className,
                    {
                        hidden,
                        ignoreHalo,
                        'constrict-field': constrictField,
                    },
                )}
            >
                <LabelElement
                    id={labelId}
                    className="input-label"
                    htmlFor={inputId}
                >
                    <input
                        ref={this.inputRef}
                        id={inputId}
                        type="checkbox"
                        disabled={disabled}
                        onChange={this.handleChange}
                        onClick={this.handleClick}
                        aria-describedby={describedBy ?? undefined}
                        title={title ?? undefined}
                        aria-labelledby={labelledBy ?? undefined}
                        aria-label={ariaLabel ?? undefined}
                    />
                    <span className="check-content">
                        <span className="check" />
                    </span>
                    {labelContentElement}
                </LabelElement>
                <InputMessages id={descriptionId} messages={messages} />
            </span>
        );
    }
}

export default CheckInput;
