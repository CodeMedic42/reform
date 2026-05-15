import React from 'react';
import Timeline from '../../../../../../reactive/dist/components/display/timeline';

const events = [
    { id: 'AA', title: 'Event AA', parent: 'D' },
    { id: 'A', title: 'Event A', parent: 'B',
        ancillaryParents: ['I']
    },
    { id: 'B', title: 'Event B', parent: 'C',
        ancillaryParents: ['D', 'F']
    },
    { id: 'BB', title: 'Event BB',
        ancillaryParents: ['C']
    },
    { id: 'C', title: 'Event C', parent: 'H' },
    { id: 'CC', title: 'Event CC',
        ancillaryParents: [
            'I',
            'K'
        ]
    },
    { id: 'D', title: 'Event D', parent: 'E' },
    { id: 'E', title: 'Event E', parent: 'I',
        ancillaryParents: ['H']
    },
    { id: 'F', title: 'Event F', parent: 'G',
        ancillaryParents: ['H']
    },
    { id: 'G', title: 'Event G',
        ancillaryParents: ['J']
    },
    { id: 'H', title: 'Event H', parent: 'J' },
    { id: 'I', title: 'Event I',
        ancillaryParents: ['K']
    },
    { id: 'J', title: 'Event J', parent: 'K' },
    { id: 'K', title: 'Event K', parent: null },
];

const colors = ['blue', 'purple', 'green', 'orange', 'red'];

function example() {
    return (
        <Timeline
            events={events}
            colors={colors}
            expandable
            renderEvent={(event) => (
                <div style={{ height: 40 }}>
                    Content for {event.id}
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
