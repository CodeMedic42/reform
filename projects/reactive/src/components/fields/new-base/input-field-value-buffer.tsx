import React from 'react';
import { noop } from 'lodash-es';

interface InputValueBufferProps {
    value?: string | number | null;
    onChange?: (value: string | number | null) => void;
    children: (args: { value: string | number | null; onChange: (value: string | number | null) => void }) => React.ReactNode;
}

interface InputValueBufferState {
    value: string | number | null;
    previousValue: string | number | null;
}

class InputValueBuffer extends React.PureComponent<InputValueBufferProps, InputValueBufferState> {
    static defaultProps = {
        value: null,
        onChange: noop,
    };

    constructor(props: InputValueBufferProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        const { value } = props;

        this.state = {
            value: value ?? null,
            previousValue: value ?? null,
        };
    }

    static getDerivedStateFromProps(nextProps: InputValueBufferProps, currentState: InputValueBufferState) {
        const { value: nextValue } = nextProps;

        if (nextValue === currentState.previousValue) {
            // Nothing changed use current state value.
            return null;
        }

        return {
            value: nextValue,
        };
    }

    handleChange(newValue: string | number | null) {
        const { onChange = noop } = this.props;

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
