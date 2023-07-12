import React, { Component } from 'react';
import getHarness from './harness-registration';

class TestRoot extends Component {
    constructor(props) {
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

    handleRenderHarness(harnessId) {
        this.setState({
            harnessId,
        });
    }

    handleClearHarness(keepProps = false) {
        const newState = {
            harnessId: null,
        };

        if (!keepProps) {
            newState.harnessProps = {};
        }

        this.setState(newState);
    }

    handleSetProps(newProps) {
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

    render() {
        const {
            harnessProps,
            harnessId,
        } = this.state;

        const Harness = getHarness(harnessId);

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