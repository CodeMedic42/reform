import React from 'react';
import Timeline from '../../../../../../reactive/dist/components/display/timeline';

const moments = [
    { id: 'AA', parent: 'D' },
    { id: 'A', parent: 'B', 
        ancillaryParents: ['I']
    },
    { id: 'B', parent: 'C', 
        ancillaryParents: ['D', 'F'] 
    },
    { id: 'BB', 
        ancillaryParents: ['C'] 
    },
    { id: 'C', parent: 'H' },
    { id: 'CC', 
        ancillaryParents: [
            'I', 
            'K'
        ] 
    },
    { id: 'D', parent: 'E' },
    { id: 'E', parent: 'I', 
        ancillaryParents: ['H'] 
    },
    { id: 'F', parent: 'G', 
        ancillaryParents: ['H'] 
    },
    { id: 'G', 
        ancillaryParents: ['J'] 
    },
    { id: 'H', parent: 'J' },
    { id: 'I', 
        ancillaryParents: ['K'] 
    },
    { id: 'J', parent: 'K' },
    { id: 'K', parent: null },
];

const colors = ['blue', 'purple', 'green', 'orange', 'red'];

function example() {
    return (
        <Timeline
            moments={moments}
            colors={colors}
            renderMoment={(moment) => (
                <div style={{ height: 20 }}>
                    {moment.id}
                </div>
            )}
        />
    );
}

example.storyName = 'Preview';
example.parameters = {
    options: {
        showPanel: true,
    },
};

export default example;
