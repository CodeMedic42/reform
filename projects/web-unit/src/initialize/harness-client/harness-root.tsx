import React, { Component, ReactNode } from 'react';
import getHarness from './harness-registration.js';

interface TestRootProps {}

interface TestRootState {
    harnessProps: Record<string, unknown>;
    harnessId: string | null;
}

declare global {
    interface Window {
        renderHarness: (harnessId: string) => void;
        setProps: (newProps: Record<string, unknown>) => void;
        clearHarness: (keepProps?: boolean) => void;
    }
}

class TestRoot extends Component<TestRootProps, TestRootState> {
    constructor(props: TestRootProps) {
        super(props);

        this.handleRenderHarness = this.handleRenderHarness.bind(this);
        this.handleSetProps = this.handleSetProps.bind(this);
        this.handleClearHarness = this.handleClearHarness.bind(this);

        window.renderHarness = this.handleRenderHarness;
        window.setProps = this.handleSetProps;
        window.clearHarness = this.handleClearHarness;

        this.state = {
            harnessProps: {},
            harnessId: null,
        };
    }

    handleRenderHarness(harnessId: string): void {
        this.setState({
            harnessId,
        });
    }

    handleClearHarness(keepProps: boolean = false): void {
        const newState: Partial<TestRootState> = {
            harnessId: null,
        };

        if (!keepProps) {
            newState.harnessProps = {};
        }

        this.setState(newState as TestRootState);
    }

    handleSetProps(newProps: Record<string, unknown>): void {
        const {
            harnessProps,
        } = this.state;

        this.setState({
            harnessProps: {
                ...harnessProps,
                ...newProps,
            }
        });
    }

    render(): ReactNode {
        const {
            harnessProps,
            harnessId,
        } = this.state;

        const Harness = harnessId != null ? getHarness(harnessId) : undefined;

        if (Harness == null) {
            return (
                <div className="web-unit-harness-root no-harness">
                    Harness Not Loaded
                </div>
            );
        }

        return (
            <div key={harnessId} className="web-unit-harness-root">
                <Harness {...harnessProps}/>
            </div>
        );

    }
}

export default TestRoot;
