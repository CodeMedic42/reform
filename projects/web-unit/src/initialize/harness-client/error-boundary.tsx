import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    errorMessage: string | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);

        this.state = { errorMessage: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { errorMessage: error.message };
    }

    render(): ReactNode {
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
