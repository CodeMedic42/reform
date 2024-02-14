import React from 'react';
import noop from 'lodash/noop';
import PropTypes from '../../../common/prop-types';

class InputValue extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

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

    render() {
        const {
            children,
        } = this.props;

        const { value } = this.state;

        return (
            children({
                value,
                onChange: this.handleChange,
            })
        );
    }
}

InputValue.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    children: PropTypes.func.isRequired,
};

InputValue.defaultProps = {
    value: null,
    onChange: noop,
};

export default InputValue;
