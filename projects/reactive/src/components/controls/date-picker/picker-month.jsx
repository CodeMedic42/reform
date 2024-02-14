import React from 'react';
import classnames from 'classnames';
import MonthDays from './month-days';
import PropTypes from '../../../common/prop-types';

function getMonthName(month) {
    switch (month) {
        case 1:
            return 'January';
        case 2:
            return 'February';
        case 3:
            return 'March';
        case 4:
            return 'April';
        case 5:
            return 'May';
        case 6:
            return 'June';
        case 7:
            return 'July';
        case 8:
            return 'August';
        case 9:
            return 'September';
        case 10:
            return 'October';
        case 11:
            return 'November';
        case 12:
            return 'December';
        default:
            throw new Error('Invalid Month');
    }
  }

function PickerMonth(props) {
    const {
        id,
        className,
        fromDate,
        toDate,
        targetDate,
        onSelect,
        month,
        year,
        firstDate,
        lastDate,
    } = props;

    return (
        <div id={id} className={classnames('ra-picker-month', className)} width="content">
            <div className="ra-picker-month-header">
                <span className="ra-picker-month-name">{`${getMonthName(month)}, ${year}`}</span>
            </div>
            <MonthDays
                currentYear={year}
                currentMonth={month}
                fromDate={fromDate}
                toDate={toDate}
                targetDate={targetDate}
                onSelect={onSelect}
                firstDate={firstDate}
                lastDate={lastDate}
            />
        </div>
    );
}

PickerMonth.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    fromDate: PropTypes.instanceOf(Date),
    toDate: PropTypes.instanceOf(Date),
    onSelect: PropTypes.func,
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
    targetDate: PropTypes.instanceOf(Date),
    firstDate: PropTypes.arrayOf(PropTypes.number),
    lastDate: PropTypes.arrayOf(PropTypes.number),
};

PickerMonth.defaultProps = {
    id: null,
    className: null,
    onSelect: null,
    fromDate: null,
    toDate: null,
    targetDate: null,
    firstDate: null,
    lastDate: null,
};

export default PickerMonth;