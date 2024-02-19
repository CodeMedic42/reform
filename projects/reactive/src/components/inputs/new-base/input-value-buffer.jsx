import React from 'react';
import noop from 'lodash/noop';
import PropTypes from '../../../common/prop-types';

class InputValueBuffer extends React.PureComponent {
    static propTypes = {
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        onChange: PropTypes.func,
        children: PropTypes.func.isRequired,
    };

    static defaultProps = {
        value: null,
        onChange: noop,
    };

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        const { value } = props;

        this.state = {
            value,
            previousValue: value,
        };
    }

    static getDerivedStateFromProps(nextProps, currentState) {
        const { value: nextValue } = nextProps;

        if (nextValue === currentState.previousValue) {
            // Nothing changed use current state value.
            return null;
        }

        return {
            value: nextValue,
        };
    }

    handleChange(newValue) {
        const { onChange } = this.props;

        const { value: currentValue } = this.state;

        if (currentValue === newValue) {
            return;
        }

        this.setState({
            value: newValue,
        });

        onChange(newValue);
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

export default InputValueBuffer;
