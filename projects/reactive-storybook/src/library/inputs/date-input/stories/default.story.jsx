import React, { useState } from 'react';
import DateInput from '@reformjs/reactive/inputs/date-input';

export default function DefaultStory() {
    const [value, setValue] = useState(null);

    return (
        <DateInput
            value={value}
            onChange={setValue}
            fitToContent
        />
    );
}
