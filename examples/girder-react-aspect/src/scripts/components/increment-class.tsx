import React, { Component } from 'react';
import { girderReactContext } from '@reformjs/girder-react-aspect';
import consoleGreet from '../actions/console-greet';

class IncrementClass extends Component {
    constructor(props) {
        super(props);

        this.state = {
            count: 0,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const { count } = this.state;

        const { useAction } = this.context;

        useAction(consoleGreet, 'Player 2');

        this.setState({
            count: count + 1,
        });
    }

    render() {
        const { count } = this.state;

        const { useAspect } = this.context;

        const aspect = useAspect('hello');

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