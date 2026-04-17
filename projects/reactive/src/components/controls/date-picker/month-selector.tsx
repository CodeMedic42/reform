import React from 'react';
import SelectInput from '../../fields/select-input-field/index.js';

interface MonthSelectorProps {
    month: number;
    onChange: (value: number) => void;
}

const options = [
    {
        label: 'January',
        value: 1
    },
    {
        label: 'February',
        value: 2
    },
    {
        label: 'March',
        value: 3
    },
    {
        label: 'April',
        value: 4
    },
    {
        label: 'May',
        value: 5
    },
    {
        label: 'June',
        value: 6
    },
    {
        label: 'July',
        value: 7
    },
    {
        label: 'August',
        value: 8
    },
    {
        label: 'September',
        value: 9
    },
    {
        label: 'October',
        value: 10
    },
    {
        label: 'November',
        value: 11
    },
    {
        label: 'December',
        value: 12
    },
];

function MonthSelector(props: MonthSelectorProps): React.ReactNode {
    const {
        month,
        onChange,
    } = props;

    return (
        <SelectInput
            className="ra-month-selector"
            value={month}
            onChange={onChange}
            options={options}
            size='sm'
        />
    );
}

export default MonthSelector;
