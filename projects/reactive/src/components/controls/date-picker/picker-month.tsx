import React from 'react';
import classnames from 'classnames';
import MonthDays from './month-days.js';

interface PickerMonthProps {
    id?: string | null;
    className?: string | null;
    fromDate?: Date | null;
    toDate?: Date | null;
    onSelect?: ((date: Date) => void) | null;
    month: number;
    year: number;
    targetDate?: Date | null;
    firstDate?: number[] | null;
    lastDate?: number[] | null;
}

function getMonthName(month: number): string {
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

function PickerMonth(props: PickerMonthProps): React.ReactNode {
    const {
        id = null,
        className = null,
        fromDate = null,
        toDate = null,
        targetDate = null,
        onSelect = null,
        month,
        year,
        firstDate = null,
        lastDate = null,
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

export default PickerMonth;
