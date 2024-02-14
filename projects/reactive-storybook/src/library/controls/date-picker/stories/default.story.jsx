import React, { useCallback, useState } from 'react';
import DatePicker from '@reformjs/reactive/controls/date-picker';
import format from 'date-fns/format';

export default function DefaultStory() {
    const [from] = useState(new Date(2023, 5 - 1, 24));

    const [to] = useState(new Date(2023, 6 - 1, 8));

    const [target] = useState(new Date(2023, 5 - 1, 22));

    const handleSelect = useCallback((date) => {
        // eslint-disable-next-line no-console
        console.log(format(date, 'yyyy/MM/dd'));
    }, []);

    return (
        <>
            <DatePicker
                fromDate={from}
                toDate={to}
                minDate={new Date('1980/4/6')}
                maxDate={new Date('2000/8/24')}
                onSelect={handleSelect}
                targetDate={target}
            />
        </>
    );
}
