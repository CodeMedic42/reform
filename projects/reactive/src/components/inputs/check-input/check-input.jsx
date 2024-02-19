/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import { schemeColorPropType } from '../../../common/color-list';
import InputMessages from '../input-messages';
import buildLabeledControlProps from '../../../common/build-labeled-control-props';

class CheckInput extends PureComponent {
    static propTypes = {
        // eslint-disable-next-line react/no-unused-prop-types
        id: PropTypes.string,
        className: PropTypes.string,
        label: PropTypes.string,
        messages: PropTypes.shape({
            general: PropTypes.arrayOf(PropTypes.string),
            success: PropTypes.arrayOf(PropTypes.string),
            failure: PropTypes.arrayOf(PropTypes.string),
        }),
        // eslint-disable-next-line react/no-unused-prop-types
        'aria-label': PropTypes.string,
        // eslint-disable-next-line react/no-unused-prop-types
        'aria-labelledby': PropTypes.string,
        // eslint-disable-next-line react/no-unused-prop-types
        'aria-describedby': PropTypes.string,
        title: PropTypes.string,
        color: schemeColorPropType,
        variant: PropTypes.oneOf(['check', 'indeterminate']),
        value: PropTypes.bool,
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
        onChange: PropTypes.func,
        // eslint-disable-next-line react/forbid-prop-types
        onChangeMeta: PropTypes.any,
        onClick: PropTypes.func,
        // eslint-disable-next-line react/forbid-prop-types
        onClickMeta: PropTypes.any,
        disabled: PropTypes.bool,
        hidden: PropTypes.bool,
        ignoreHalo: PropTypes.bool,
        constrictField: PropTypes.bool,
    };

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

    constructor(props) {
        super(props);

        this.inputRef = createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);

        this.state = {};
    }

    static getDerivedStateFromProps(nextProps) {
        return buildLabeledControlProps(nextProps);
    }

    componentDidMount() {
        this.setCheckedAttribute();
    }

    componentDidUpdate() {
        this.setCheckedAttribute();
    }

    handleChange(event) {
        const { onChange, onChangeMeta } = this.props;

        if (isNil(onChange)) {
            return;
        }

        onChange(event.target.checked === true, {
            event,
            meta: onChangeMeta,
        });
    }

    handleClick(event) {
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

        let labelContentElement = null;
        let LabelElement = 'span';

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
                        aria-describedby={describedBy}
                        title={title}
                        aria-labelledby={labelledBy}
                        aria-label={ariaLabel}
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
