import React, { useState } from 'react';
import MonthSelectField from '@reformjs/reactive/fields/prepared/month-select-field';

export default function DefaultStory() {
    const [value, setValue] = useState<number | null>(null);

    return (
        <>
            <MonthSelectField
                value={value}
                onChange={setValue}
            />
            <div><span>{`Value: ${value}`}</span></div>
        </>
    );
}
