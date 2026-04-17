/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { createRef, PureComponent } from 'react';
import classnames from 'classnames';
import shortId from 'shortid';
import { isNil, isEmpty } from 'lodash-es';
import InputMessages from '../../input-field-messages/index.js';
import { Text } from '../../../display/typography/index.js';

interface InputMessagesData {
    general?: string[];
    success?: string[];
    failure?: string[];
}

interface ChildArgs {
    finalId: string;
    describedBy: string | null;
    labelledBy: string;
    inputId: string;
}

interface InputLabelProps {
    id?: string | null;
    className?: string | null;
    label?: string | null;
    messages?: InputMessagesData | null;
    failure?: boolean;
    'aria-labelledby'?: string | null;
    'aria-describedby'?: string | null;
    hidden?: boolean;
    disabled?: boolean;
    size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg';
    children: (args: ChildArgs) => React.ReactNode;
}

interface InputLabelState {
    finalId: string;
    labelId: string;
    inputId: string;
    descriptionId: string | null;
    labelledBy: string;
    describedBy: string | null;
    baseId: string;
}

class InputLabel extends PureComponent<InputLabelProps, InputLabelState> {
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
        size: 'md',
    };

    labelRef: React.RefObject<unknown>;
    inputContainerRef: React.RefObject<any>;

    constructor(props: InputLabelProps) {
        super(props);

        this.labelRef = createRef();
        this.inputContainerRef = createRef();

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

    static getDerivedStateFromProps(nextProps: InputLabelProps, currentState: InputLabelState) {
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
        return this.inputContainerRef.current.getInputElement();
    }

    focus() {
        this.inputContainerRef.current.focus();
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
            className, label, hidden, messages, failure, size, children,
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

        const LabelElement = !isNil(label) && label.length > 0 ? 'label' : 'div';

        if (!isNil(label)) {
            labelText = (
                <Text
                    className="label-text"
                    size="md"
                    weight="semi-bold"
                    ref={this.labelRef}
                >
                    {label}
                </Text>
            );
        }

        return (
            <div
                id={finalId}
                className={classnames('ra-input', `size-${size}`, className, {
                    hidden,
                    failure,
                })}
            >
                <LabelElement
                    className="ra-input-label"
                    id={labelId}
                    htmlFor={inputId}
                    tabIndex="-1"
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
                <InputMessages id={descriptionId} messages={messages} />
            </div>
        );
    }
}

export default InputLabel;
