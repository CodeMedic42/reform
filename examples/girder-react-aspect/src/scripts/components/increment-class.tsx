import React, { Component } from 'react';
import { girderReactContext, GirderReactContextValue } from '@reformjs/girder-react-aspect';
import consoleGreet from '../actions/console-greet';

interface HelloAspect {
    greet: (name: string) => string;
}

interface IncrementClassState {
    count: number;
}

class IncrementClass extends Component<Record<string, never>, IncrementClassState> {
    declare context: GirderReactContextValue;

    constructor(props: Record<string, never>) {
        super(props);

        this.state = {
            count: 0,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(): void {
        const { count } = this.state;

        const { useAction } = this.context;

        useAction(consoleGreet, 'Player 2');

        this.setState({
            count: count + 1,
        });
    }

    render(): React.ReactNode {
        const { count } = this.state;

        const { useAspect } = this.context;

        const aspect = useAspect('hello') as HelloAspect;

        return (
            <div>
                <div>
                    {aspect.greet('Player 2')}
                </div>
                {count}
                <button
                    type="button"
                    onClick={this.handleClick}
                >
                    Increment
                </button>
            </div>
        );
    }
}

IncrementClass.contextType = girderReactContext;

export default IncrementClass;
