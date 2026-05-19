import React, { useState } from 'react';
import YearSelectField from '@reformjs/reactive/fields/prepared/year-select-field';

export default function DefaultStory() {
    const [value, setValue] = useState<number | null>(null);

    return (
        <>
            <YearSelectField
                value={value}
                onChange={setValue}
            />
            <div><span>{`Value: ${value}`}</span></div>
        </>
    );
}
