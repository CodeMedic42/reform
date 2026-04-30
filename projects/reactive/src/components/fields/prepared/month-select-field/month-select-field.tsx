import React from 'react';
import SelectField from '../../single-select-field/index.js';

interface MonthSelectFieldProps {
    value: number | null;
    onChange: (value: number | null) => void;
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

function MonthSelectField(props: MonthSelectFieldProps): React.ReactNode {
    const {
        value: month,
        onChange,
    } = props;

    return (
        <SelectField
            className="ra-month-select-field"
            value={month}
            onChange={onChange}
            options={options}
            size='sm'
        />
    );
}

export default MonthSelectField;
