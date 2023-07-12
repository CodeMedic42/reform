import React, { Component } from 'react';

class ErrorBoundary extends Component {
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