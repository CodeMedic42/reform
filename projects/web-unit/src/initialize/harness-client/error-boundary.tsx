import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
    static propTypes = {
        // eslint-disable-next-line react/forbid-prop-types
        children: PropTypes.any.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = { errorMessage: null };
    }

    static getDerivedStateFromError(error) {
        return { errorMessage: error.message };
    }

    render() {
        const { children } = this.props;
        const { errorMessage } = this.state;

        return (
            <>
                <div>{errorMessage}</div>
                {children}
            </>
        );
    }
}

export default ErrorBoundary;