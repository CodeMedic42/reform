import React, { useState } from 'react';
import DateRangeInputField from '../../../../../../reactive/dist/components/fields/date-range-input-field';

export default function DefaultStory() {
    const [value, setValue] = useState(null);

    return (
        <DateRangeInputField
            value={value}
            onChange={setValue}
            fitTo="placeholder"
            label=""
            // leftAnnotation={<span>Foo</span>}
            // rightAnnotation={<span>Bar</span>}
        />
    );
}
