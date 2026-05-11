import React from 'react';
import Timeline from '../../../../../../reactive/dist/components/display/timeline';

const moments = [
    { id: 'AA', parent: 'D' },
    { id: 'A', parent: 'B', mergeParents: ['I'] },
    { id: 'B', parent: 'C', mergeParents: ['D', 'F'] },
    { id: 'BB', parent: 'C' },
    { id: 'C', parent: 'H' },
    { id: 'CC', parent: 'K', mergeParents: ['I'] },
    { id: 'D', parent: 'E' },
    { id: 'E', parent: 'I', mergeParents: ['H'] },
    { id: 'F', parent: 'G', mergeParents: ['H'] },
    { id: 'G', parent: 'J' },
    { id: 'H', parent: 'J' },
    { id: 'I', parent: 'K' },
    { id: 'J', parent: 'K' },
    { id: 'K', parent: null },
];

const colors = ['blue', 'purple', 'green', 'orange', 'red'];

function example() {
    return (
        <Timeline
            moments={moments}
            colors={colors}
        >
            {(moment) => {
                return (
                    <div>
                        {moment.id}
                    </div>
                );
            }}
        </Timeline>
    );
}

example.storyName = 'Preview';
example.parameters = {
    options: {
        showPanel: true,
    },
};

export default example;
