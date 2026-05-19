/* @typescript-eslint/no-unused-vars */
import React, { createRef, PureComponent } from 'react';
import classnames from 'classnames';
import shortId from 'shortid';
import { isNil, isEmpty } from 'lodash-es';
import InputFieldMessages from './field-messages.js';
import type { FieldMessageData } from './field-messages.js';

interface ChildArgs {
    finalId: string;
    describedBy: string | null;
    labelledBy: string;
    inputId: string;
}

interface FieldProps {
    id?: string | null;
    className?: string | null;
    label?: string | null;
    messages?: FieldMessageData | null;
    failure?: boolean;
    'aria-labelledby'?: string | null;
    'aria-describedby'?: string | null;
    hidden?: boolean;
    disabled?: boolean;
    variant?: string | null;
    size?: string;
    children: (args: ChildArgs) => React.ReactNode;
}

interface FieldState {
    finalId: string;
    labelId: string;
    inputId: string;
    descriptionId: string | null;
    labelledBy: string;
    describedBy: string | null;
    baseId: string;
}

class Field extends PureComponent<FieldProps, FieldState> {
    static defaultProps = {
        id: null,
        messages: null,
        failure: false,
        className: null,
        label: null,
        'aria-labelledby': null,
        'aria-describedby': null,
        hidden: false,
        disabled: false,
        variant: null,
    };

    labelRef: React.RefObject<unknown>;

    FieldContainerRef: React.RefObject<any>;

    constructor(props: FieldProps) {
        super(props);

        this.labelRef = createRef();
        this.FieldContainerRef = createRef();

        this.labelPreventDefault = this.labelPreventDefault.bind(this);

        this.state = {
            labelId: '',
            inputId: '',
            descriptionId: null,
            labelledBy: '',
            describedBy: null,
            finalId: '',
            baseId: shortId.generate(),
        };
    }

    static getDerivedStateFromProps(nextProps: FieldProps, currentState: FieldState) {
        const {
            id,
            messages,
            'aria-labelledby': ariaLabelledBy,
            'aria-describedby': ariaDescribedBy,
        } = nextProps;

        const finalId = !isEmpty(id) ? id! : currentState.baseId;

        const labelId = `${finalId}-label`;
        const inputId = `${finalId}-input`;
        const descriptionId = isNil(messages)
            || (isEmpty(messages.general) && isEmpty(messages.failure))
            ? null
            : `${finalId}-description`;

        const labelledBy = !isNil(ariaLabelledBy) && ariaLabelledBy.length > 0
            ? `${ariaLabelledBy} ${labelId}`
            : labelId;

        const describedBy = !isNil(ariaDescribedBy) && ariaDescribedBy.length > 0
            ? `${ariaDescribedBy}${descriptionId !== null ? ` ${descriptionId}` : ''}`
            : descriptionId;

        return {
            finalId,
            labelId,
            inputId,
            labelledBy,
            describedBy,
            descriptionId,
        };
    }

    getInputElement() {
        return this.FieldContainerRef.current.getInputElement();
    }

    focus() {
        this.FieldContainerRef.current.focus();
    }

    labelPreventDefault(event: React.MouseEvent) {
        const { disabled } = this.props;

        if (disabled) {
            return;
        }

        if (event.target === (this.labelRef as React.RefObject<Element>).current) {
            event.preventDefault();
        }
    }

    render() {
        const {
            className, label, hidden, messages, failure, variant, children,
        } = this.props;

        const {
            labelId,
            inputId,
            descriptionId,
            finalId,
            describedBy,
            labelledBy,
        } = this.state;

        let labelText: React.ReactNode = null;
        let LabelElement: React.ElementType = 'div';


        if (!isNil(label)) {
            labelText = (
                <span
                    className="ra-field-label-text"
                    ref={this.labelRef as React.RefObject<HTMLSpanElement>}
                >
                    {label}
                </span>
            );

            if (label.length > 0) {
                LabelElement = 'label';
            }
        }

        return (
            <div
                id={finalId}
                className={classnames('ra-field', className, {
                    [`ra-field-variant-${variant}`]: !isEmpty(variant),
                    hidden,
                    failure,
                })}
            >
                <LabelElement
                    className="ra-field-label"
                    id={labelId}
                    htmlFor={inputId}
                    tabIndex={-1}
                    onMouseDown={this.labelPreventDefault}
                >
                    {labelText}
                    {children({
                        finalId,
                        describedBy,
                        labelledBy,
                        inputId,
                    })}
                </LabelElement>
                <InputFieldMessages id={descriptionId} messages={messages} />
            </div>
        );
    }
}

export default Field;
