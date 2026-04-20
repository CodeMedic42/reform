import React, { useState } from 'react';
import DateInputField from '@reformjs/reactive/fields/date-input-field';

export default function DefaultStory() {
    const [value, setValue] = useState<Date | null>(null);

    return (
        <DateInputField
            value={value}
            onChange={setValue}
        />
    );
}
