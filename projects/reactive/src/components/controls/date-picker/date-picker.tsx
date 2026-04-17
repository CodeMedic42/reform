import React, { forwardRef, useRef, useImperativeHandle, useMemo } from 'react';
import classnames from 'classnames';
/* eslint-disable import/no-duplicates */
import getDate from 'date-fns/getDate';
import getMonth from 'date-fns/getMonth';
import getYear from 'date-fns/getYear';
import isEqual from 'date-fns/isEqual';
/* eslint-enable import/no-duplicates */
import { isNil } from 'lodash-es';
import PickerMonth from './picker-month.js';
import buildId from '../../../common/build-id.js';
import InfiniteList, { InfiniteListItems } from '../../arrangement/infinite-list/index.js';

interface DatePickerProps {
    id?: string | null;
    className?: string | null;
    fromDate?: Date | null;
    toDate?: Date | null;
    targetDate?: Date | null;
    onSelect?: ((date: Date) => void) | null;
    hold?: boolean;
    minDate: Date;
    maxDate?: Date | null;
}

export interface DatePickerHandle {
    gotoDate: (date: Date) => void;
}

function getDateArray(date: Date): [number, number, number] {
    const day = getDate(date);
    const month = getMonth(date) + 1;
    const year = getYear(date);

    return [year, month, day];
}

const DatePicker = forwardRef<DatePickerHandle, DatePickerProps>((props, ref) => {
    const {
        id = null,
        className = null,
        onSelect = null,
        targetDate = null,
        hold = false,
        minDate,
        maxDate = null,
    } = props;

    let {
        fromDate,
        toDate,
    } = props;

    if (isNil(minDate)) {
        throw new Error('minDate is a required field');
    }

    if (!isNil(fromDate) && !isNil(toDate) && toDate < fromDate) {
        // eslint-disable-next-line no-console
        console.error('ToDate cannot be less than fromDate');

        fromDate = null;
        toDate = null;
    }

    const infiniteListRef = useRef<{ gotoIndex: (index: [number, number]) => void }>(null);


    const startDate = useMemo(
        () => {
            let startTarget = !isNil(fromDate) ? fromDate : new Date();

            if (startTarget < minDate) {
                startTarget = minDate;
            } else if (!isNil(maxDate) && maxDate < startTarget) {
                startTarget = maxDate;
            }

            const [year, month] = getDateArray(startTarget);

            return [year, month];
        },
        []
    );

    const {
        minIndex,
        firstIndex,
        fullFirstDate,
    } = useMemo(() => {
        const [year, month, day] = getDateArray(minDate);

        return {
            minIndex: [year, 1] as [number, number],
            firstIndex: [year, month] as [number, number],
            fullFirstDate: [year, month, day] as [number, number, number],
        };
    }, [minDate]);

    const {
        lastIndex,
        maxIndex,
        fullLastDate,
    } = useMemo(() => {
        let year: number | null = null;
        let month = 12;
        let day: number | null = null;

        if (!isNil(maxDate))  {
            [year, month, day] = getDateArray(maxDate);
        }

        return {
            lastIndex: !isNil(year) ? [year, month] as [number, number] : null,
            maxIndex: [year, 12] as [number | null, number],
            fullLastDate: !isNil(day) ? [year, month, day] as [number | null, number, number] : null,
        };
    }, [maxDate]);

    useImperativeHandle(ref, () => ({
        gotoDate: (date: Date) => {
            const [year, month] = getDateArray(date);

            let failed = false;

            if (year < firstIndex[0]) {
                failed = true;
            } else if (year === firstIndex[0] && month < firstIndex[1]) {
                failed = true;
            } else if (!isNil(lastIndex) && year > lastIndex[0]) {
                failed = true;
            } else if (!isNil(lastIndex) && year === lastIndex[0] && month > lastIndex[1]) {
                failed = true;
            }

            if (failed) {
                throw new Error('The gotoDate value must between minDate and maxDate inclusively');
            }

            infiniteListRef.current!.gotoIndex([year, month]);
		},
    }));

    return (
        <InfiniteList
            ref={infiniteListRef}
            id={id}
            className={classnames('ra-date-picker', className)}
            loadCount={10}
            bufferCount={5}
            minIndex={minIndex}
            firstIndex={firstIndex}
            startingIndex={startDate}
            lastIndex={lastIndex}
            maxIndex={maxIndex}
            topOffset
            hold={hold}
        >
            <div className="ra-picker-week-header">
                <span className="ra-picker-week-day">Su</span>
                <span className="ra-picker-week-day">Mo</span>
                <span className="ra-picker-week-day">Tu</span>
                <span className="ra-picker-week-day">We</span>
                <span className="ra-picker-week-day">Th</span>
                <span className="ra-picker-week-day">Fr</span>
                <span className="ra-picker-week-day">Sa</span>
            </div>
            <InfiniteListItems
                render={(_: unknown, [year, month]: [number, number]) => (
                    <PickerMonth
                        id={buildId(id, `${year}-${month}`)}
                        month={month}
                        year={year}
                        firstDate={fullFirstDate}
                        lastDate={fullLastDate}
                        fromDate={fromDate}
                        toDate={!isEqual(fromDate, toDate) ? toDate : null}
                        onSelect={onSelect}
                        targetDate={targetDate}
                    />
                )}
            />
        </InfiniteList>
    );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
