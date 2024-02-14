import React from 'react';
import InputLabel from '@reformjs/reactive/inputs/base/input-label';

export default function DefaultStory() {
    return (
        <InputLabel
            label='Test Label'
        >
            {() => 'asdas'}
        </InputLabel>
    );
}
