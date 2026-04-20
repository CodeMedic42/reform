import React from 'react';
import format from 'date-fns/format';
import lastDayOfMonth from 'date-fns/lastDayOfMonth';
/* eslint-enable import/no-duplicates */
import { toFinite, isNil, map } from 'lodash-es';
import PickerWeek from './picker-week.js';
import PickerDay from './picker-day.js';

interface MonthDaysProps {
    currentYear: number;
    currentMonth: number;
    fromDate?: Date | null;
    toDate?: Date | null;
    targetDate?: Date | null;
    onSelect?: ((date: Date) => void) | null;
    firstDate?: number[] | null;
    lastDate?: number[] | null;
}

function MonthDays(props: MonthDaysProps): React.ReactNode {
    const {
        currentYear,
        currentMonth,
        fromDate = null,
        toDate = null,
        targetDate = null,
        onSelect = null,
        firstDate = null,
        lastDate = null,
    } = props;

    const firstMonthDay = 1;
    const firstMonthDayDate = new Date(currentYear, currentMonth - 1, firstMonthDay);
    const lastMonthDayDate = lastDayOfMonth(firstMonthDayDate);
    const lastMonthDay = toFinite(format(lastDayOfMonth(lastMonthDayDate), 'd'));

    let firstDayWeekdayNumber = toFinite(format(firstMonthDayDate, 'i'));
    firstDayWeekdayNumber = firstDayWeekdayNumber === 7 ? 1 : firstDayWeekdayNumber + 1;

    let weekDay = firstDayWeekdayNumber;
    let currentWeek: React.ReactNode[] = [];
    const weeks: React.ReactNode[][] = [];

    for (let dayCounter = firstMonthDay; dayCounter <= lastMonthDay; dayCounter += 1) {
        const dayDate = new Date(currentYear, currentMonth - 1, dayCounter);

        let disabled = false;

        if (!isNil(firstDate) && firstDate[0] === currentYear && firstDate[1] === currentMonth && dayCounter < firstDate[2]) {
            disabled = true;
        } else if (!isNil(lastDate) && lastDate[0] === currentYear && lastDate[1] === currentMonth && dayCounter > lastDate[2]) {
            disabled = true;
        }

        currentWeek.push(
            <PickerDay
                key={dayCounter}
                dayDate={dayDate}
                fromDate={fromDate}
                toDate={toDate}
                targetDate={targetDate}
                onSelect={onSelect}
                disabled={disabled}
            />
        );

        if (weekDay >= 7 && dayCounter !== lastMonthDay) {
            weekDay = 1;

            weeks.push(currentWeek);
            currentWeek = [];
        } else {
            weekDay += 1;
        }
    }

    weeks.push(currentWeek);

    return (
        <>
            {map(weeks, (week, index) => (
                <PickerWeek key={index}>
                    {week}
                </PickerWeek>
            ))}
            {weeks.length < 6 ?  <PickerWeek passive /> : null}
        </>
    );
}

export default MonthDays;
