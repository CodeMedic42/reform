import React, { useState } from 'react';
import DateSelectField from '@reformjs/reactive/fields/date-select-field';

export default function DefaultStory() {
    const [value, setValue] = useState<Date | null>(null);

    return (
        <DateSelectField
            value={value}
            onChange={setValue}
        />
    );
}
