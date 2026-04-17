import React from 'react';
import format from 'date-fns/format';
import lastDayOfMonth from 'date-fns/lastDayOfMonth';
import { toFinite, isNil, map } from 'lodash-es';
import PickerWeek from './picker-week.mjs';
import PickerDay from './picker-day.mjs';
import '../../../common/prop-types.mjs';
import PropTypes from 'prop-types';

function MonthDays(props) {
    const { currentYear, currentMonth, fromDate, toDate, targetDate, onSelect, firstDate, lastDate, } = props;
    const firstMonthDay = 1;
    const firstMonthDayDate = new Date(currentYear, currentMonth - 1, firstMonthDay);
    const lastMonthDayDate = lastDayOfMonth(firstMonthDayDate);
    const lastMonthDay = toFinite(format(lastDayOfMonth(lastMonthDayDate), 'd'));
    let firstDayWeekdayNumber = toFinite(format(firstMonthDayDate, 'i'));
    firstDayWeekdayNumber = firstDayWeekdayNumber === 7 ? 1 : firstDayWeekdayNumber + 1;
    let weekDay = firstDayWeekdayNumber;
    let currentWeek = [];
    const weeks = [];
    for (let dayCounter = firstMonthDay; dayCounter <= lastMonthDay; dayCounter += 1) {
        const dayDate = new Date(currentYear, currentMonth - 1, dayCounter);
        let disabled = false;
        if (firstDate[0] === currentYear && firstDate[1] === currentMonth && dayCounter < firstDate[2]) {
            disabled = true;
        }
        else if (!isNil(lastDate) && lastDate[0] === currentYear && lastDate[1] === currentMonth && dayCounter > lastDate[2]) {
            disabled = true;
        }
        currentWeek.push(React.createElement(PickerDay, { key: dayCounter, dayDate: dayDate, fromDate: fromDate, toDate: toDate, targetDate: targetDate, onSelect: onSelect, disabled: disabled }));
        if (weekDay >= 7 && dayCounter !== lastMonthDay) {
            weekDay = 1;
            weeks.push(currentWeek);
            currentWeek = [];
        }
        else {
            weekDay += 1;
        }
    }
    weeks.push(currentWeek);
    return (React.createElement(React.Fragment, null,
        map(weeks, (week, index) => (React.createElement(PickerWeek, { key: index }, week))),
        weeks.length < 6 ? React.createElement(PickerWeek, { passive: true }) : null));
}
MonthDays.propTypes = {
    currentYear: PropTypes.number.isRequired,
    currentMonth: PropTypes.number.isRequired,
    fromDate: PropTypes.instanceOf(Date),
    toDate: PropTypes.instanceOf(Date),
    targetDate: PropTypes.instanceOf(Date),
    onSelect: PropTypes.func,
    firstDate: PropTypes.arrayOf(PropTypes.number),
    lastDate: PropTypes.arrayOf(PropTypes.number),
};
MonthDays.defaultProps = {
    fromDate: null,
    toDate: null,
    targetDate: null,
    onSelect: null,
    firstDate: null,
    lastDate: null,
};

export { MonthDays as default };
