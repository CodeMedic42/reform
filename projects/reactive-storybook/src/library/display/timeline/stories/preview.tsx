import React, { useRef } from 'react';
import Timeline, { TimelineHandle } from '@reformjs/reactive/display/timeline';
import Button from '@reformjs/reactive/controls/button';

const events = [
    { id: 'AA', title: 'Event AA', parent: 'D' },
    { id: 'A', title: 'Event A', parent: 'B',
        ancillaryParents: ['I']
    },
    { id: 'B', title: 'Event B', parent: 'C',
        ancillaryParents: ['D', 'F']
    },
    { id: 'BB', title: 'Event BB', variant: 'square' as const,
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
    { id: 'E', title: 'Event E', parent: 'I', variant: 'triangle' as const,
        ancillaryParents: ['H']
    },
    { id: 'F', title: 'Event F', parent: 'G', variant: 'square' as const,
        ancillaryParents: ['H']
    },
    { id: 'G', title: 'Event G',
        ancillaryParents: ['J']
    },
    { id: 'H', title: 'Event H', parent: 'J', variant: 'triangle' as const },
    { id: 'I', title: 'Event I',
        ancillaryParents: ['K']
    },
    { id: 'J', title: 'Event J', parent: 'K' },
    { id: 'K', title: 'Event K', parent: null },
];

const colors = ['blue', 'purple', 'green', 'orange', 'red'];

function example() {
    const timelineRef = useRef<TimelineHandle>(null);

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <Button
                    design="fill"
                    color="primary"
                    onClick={() => timelineRef.current?.expandAll()}
                >
                    Expand
                </Button>
                <Button
                    design="fill"
                    color="primary"
                    onClick={() => timelineRef.current?.collapseAll()}
                >
                    Collapse
                </Button>
            </div>
            <Timeline
                ref={timelineRef}
                events={events}
                colors={colors}
                expandable
                renderEvent={(event) => (
                    <div style={{ height: 40 }}>
                        Content for {event.id}
                    </div>
                )}
            />
        </div>
    );
}

example.storyName = 'Preview';
example.parameters = {
    options: {
        showPanel: true,
    },
};

export default example;
