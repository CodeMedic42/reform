import React, { useState } from 'react';
import DateRangeSelectField from '@reformjs/reactive/fields/date-range-select-field';

export default function DefaultStory() {
    const [value, setValue] = useState<{ from: Date | null; to: Date | null } | null>(null);

    return (
        <DateRangeSelectField
            value={value}
            onChange={setValue}
            // leftAnnotation={<span>Foo</span>}
            // rightAnnotation={<span>Bar</span>}
        />
    );
}
