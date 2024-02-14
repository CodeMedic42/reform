import React, { useState } from 'react';
import DateRangeInput from '@reformjs/reactive/inputs/date-range-input';

export default function DefaultStory() {
    const [value, setValue] = useState(null);

    return (
        <DateRangeInput
            value={value}
            onChange={setValue}
            fitTo="placeholder"
            label=""
            // leftAnnotation={<span>Foo</span>}
            // rightAnnotation={<span>Bar</span>}
        />
    );
}
