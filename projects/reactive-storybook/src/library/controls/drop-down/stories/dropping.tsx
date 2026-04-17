/* eslint-disable no-alert */
import React, { useState } from 'react';
import findIndex from 'lodash/findIndex';
import clone from 'lodash/clone';
import DropDown, { AnchorButton } from '@reformjs/reactive/controls/drop-down';

function renderDropSelect(dropPositions, setDropPositions, index) {
    const handleDropChange = (event) => {
        const dropCopy = clone(dropPositions);

        const { value } = event.target;

        const oldValue = dropCopy[index];

        const replaceIndex = findIndex(dropCopy, (item) => item === value);

        dropCopy[index] = value;
        dropCopy[replaceIndex] = oldValue;

        setDropPositions(dropCopy);
    };

    return (
        <select
            style={{
                margin: 'auto',
                display: 'block',
            }}
            value={dropPositions[index]}
            onChange={handleDropChange}
        >
            <option value="bottom">Bottom</option>
            <option value="top">Top</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
        </select>
    );
}

function dropping() {
    const [dropPositions, setDropPositions] = useState([
        'bottom',
        'top',
        'right',
        'left',
    ]);
    const [enableTail, setEnableTail] = useState(false);
    const [enableCenter, setEnableCenter] = useState(false);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                overflow: 'scroll',
            }}
        >
            <div
                style={{
                    height: '200%',
                    width: '200%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        height: '500px',
                        width: '500px',
                        border: '1px solid black',
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 10,
                        }}
                    >
                        <DropDown
                            Anchor={AnchorButton}
                            anchorProps={{
                                children: 'Drop',
                                design: 'fill',
                            }}
                            enableTail={enableTail}
                            dropPositions={dropPositions}
                            horizontallyCenter={enableCenter}
                        >
                            <div
                                style={{
                                    height: '300px',
                                    width: '200px',
                                }}
                            >
                                Children
                            </div>
                        </DropDown>
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            zIndex: 10,
                        }}
                    >
                        <DropDown
                            Anchor={AnchorButton}
                            anchorProps={{
                                children: 'Text',
                                design: 'fill',
                            }}
                            enableTail={enableTail}
                            dropPositions={dropPositions}
                            horizontallyCenter={enableCenter}
                        >
                            <div
                                style={{
                                    height: '300px',
                                    width: '200px',
                                }}
                            >
                                Children
                            </div>
                        </DropDown>
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            zIndex: 10,
                        }}
                    >
                        <DropDown
                            Anchor={AnchorButton}
                            anchorProps={{
                                children: 'Text',
                                design: 'fill',
                            }}
                            enableTail={enableTail}
                            dropPositions={dropPositions}
                            horizontallyCenter={enableCenter}
                        >
                            <div
                                style={{
                                    height: '300px',
                                    width: '200px',
                                }}
                            >
                                Children
                            </div>
                        </DropDown>
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            zIndex: 10,
                        }}
                    >
                        <DropDown
                            Anchor={AnchorButton}
                            anchorProps={{
                                children: 'Text',
                                design: 'fill',
                            }}
                            enableTail={enableTail}
                            dropPositions={dropPositions}
                            horizontallyCenter={enableCenter}
                        >
                            <div
                                style={{
                                    height: '300px',
                                    width: '200px',
                                }}
                            >
                                Children
                            </div>
                        </DropDown>
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <div>
                            <label
                                htmlFor="enableTail"
                                style={{
                                    margin: 'auto',
                                    display: 'block',
                                }}
                            >
                                <input
                                    id="enableTail"
                                    type="checkbox"
                                    checked={enableTail}
                                    onChange={() => {
                                        setEnableTail(!enableTail);
                                    }}
                                />
                                Enable Tail
                            </label>
                            <label
                                htmlFor="enableCenter"
                                style={{
                                    margin: 'auto',
                                    display: 'block',
                                }}
                            >
                                <input
                                    id="enableCenter"
                                    type="checkbox"
                                    checked={enableCenter}
                                    onChange={() => {
                                        setEnableCenter(!enableCenter);
                                    }}
                                />
                                Enable Position Center
                            </label>
                            {renderDropSelect(
                                dropPositions,
                                setDropPositions,
                                0,
                            )}
                            {renderDropSelect(
                                dropPositions,
                                setDropPositions,
                                1,
                            )}
                            {renderDropSelect(
                                dropPositions,
                                setDropPositions,
                                2,
                            )}
                            {renderDropSelect(
                                dropPositions,
                                setDropPositions,
                                3,
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

dropping.storyName = 'Dropping';

export default dropping;
