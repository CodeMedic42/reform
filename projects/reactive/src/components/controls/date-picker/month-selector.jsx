import React from 'react';
import SelectInput from '../../inputs/select-input';
import PropTypes from '../../../common/prop-types';

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

function MonthSelector(props) {
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

MonthSelector.propTypes = {
    month: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

MonthSelector.defaultProps = {};

export default MonthSelector;