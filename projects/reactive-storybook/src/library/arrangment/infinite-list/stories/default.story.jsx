import React from 'react';
import noop from 'lodash/noop';
import InfiniteList, { InfiniteListItems } from '@reformjs/reactive/arrangement/infinite-list';

function chooseColor(index) {
    const v = index % 10;

    if (v === 0) {
        return 'purple';
    }

    if (v === 1) {
        return 'orange';
    }

    if (v === 2) {
        return 'green';
    }

    if (v === 3) {
        return 'yellow';
    }

    if (v === 4) {
        return 'magenta';
    }

    if (v === 5) {
        return 'red';
    }

    if (v === 6) {
        return 'black';
    }

    if (v === 7) {
        return 'brown';
    }

    if (v === 8) {
        return 'pink';
    }

    return 'cyan';
}

export default function DefaultStory(props) {
    return (
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
            <InfiniteList
                loadCount={70}
                bufferCount={60}
                onLoad={noop}
                startingIndex={[1980, 1]}
                minIndex={[1, 1]}
                maxIndex={[null, 12]}
                firstIndex={[1950, 6]}
                lastIndex={[2000, 8]}
            >
                <div
                    style={{
                        fontSize: '128px',
                        margin: 20,
                    }}
                >
                    Top Header
                </div>
                <InfiniteListItems
                    render={
                        (item, [x, y]) => (
                            <div
                                style={{
                                    color: 'white',
                                    fontSize: '48px',
                                    margin: 20,
                                    backgroundColor: chooseColor(x)
                                }}
                            >
                                    {`${x}:${y}`}
                            </div>
                        )
                    }
                />
            </InfiniteList>
        </div>
    );
}
