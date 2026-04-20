import React, { useState } from 'react';
import DateRangeInputField from '@reformjs/reactive/fields/date-range-input-field';

export default function DefaultStory() {
    const [value, setValue] = useState<{ from: Date | null; to: Date | null } | null>(null);

    return (
        <DateRangeInputField
            value={value}
            onChange={setValue}
            // leftAnnotation={<span>Foo</span>}
            // rightAnnotation={<span>Bar</span>}
        />
    );
}
