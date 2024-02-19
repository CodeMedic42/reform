/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { createRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import shortId from 'shortid';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import InputMessages from '../../input-messages/index';
import { Text } from '../../../display/typography/index';

class InputLabel extends PureComponent {
    static propTypes = {
        id: PropTypes.string,
        className: PropTypes.string,
        label: PropTypes.string,
        messages: PropTypes.shape({
            general: PropTypes.arrayOf(PropTypes.string),
            success: PropTypes.arrayOf(PropTypes.string),
            failure: PropTypes.arrayOf(PropTypes.string),
        }),
        failure: PropTypes.bool,
        'aria-labelledby': PropTypes.string,
        'aria-describedby': PropTypes.string,
        hidden: PropTypes.bool,
        disabled: PropTypes.bool,
        size: PropTypes.oneOf(['2xs', 'xs', 'sm', 'md', 'lg']),
        children: PropTypes.func.isRequired,
    };

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

    constructor(props) {
        super(props);

        this.labelRef = createRef();
        this.inputContainerRef = createRef();

        this.labelPreventDefault = this.labelPreventDefault.bind(this);

        this.state = {
            labelId: null,
            inputId: null,
            descriptionId: null,
            labelledBy: null,
            baseId: shortId.generate(),
        };
    }

    static getDerivedStateFromProps(nextProps, currentState) {
        const {
            id,
            messages,
            'aria-labelledby': ariaLabelledBy,
            'aria-describedby': ariaDescribedBy,
        } = nextProps;

        const finalId = !isEmpty(id) ? id : currentState.baseId;

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

    labelPreventDefault(event) {
        const { disabled } = this.props;

        if (disabled) {
            return;
        }

        if (event.target === this.labelRef.current) {
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

        let labelText = null;

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

const {
    children,
    ...exportPropTypes
    // eslint-disable-next-line react/forbid-foreign-prop-types
} = InputLabel.propTypes;

const exportDefaultProps = InputLabel.defaultProps;

export { exportPropTypes as propTypes, exportDefaultProps as defaultProps };
