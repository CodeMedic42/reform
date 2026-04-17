import React, { useState } from 'react';
import DateInputField from '../../../../../../reactive/dist/components/fields/date-input-field';

export default function DefaultStory() {
    const [value, setValue] = useState(null);

    return (
        <DateInputField
            value={value}
            onChange={setValue}
            fitToContent
        />
    );
}
