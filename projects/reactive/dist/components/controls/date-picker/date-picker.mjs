import React, { forwardRef, useRef, useMemo, useImperativeHandle } from 'react';
import classnames from 'classnames';
import getDate from 'date-fns/getDate';
import getMonth from 'date-fns/getMonth';
import getYear from 'date-fns/getYear';
import isEqual from 'date-fns/isEqual';
import { isNil } from 'lodash-es';
import PickerMonth from './picker-month.mjs';
import '../../../common/prop-types.mjs';
import buildId from '../../../common/build-id.mjs';
import InfiniteList from '../../arrangement/infinite-list/infinite-list.mjs';
import InfiniteListItems from '../../arrangement/infinite-list/infinite-list-items.mjs';
import PropTypes from 'prop-types';

function getDateArray(date) {
    const day = getDate(date);
    const month = getMonth(date) + 1;
    const year = getYear(date);
    return [year, month, day];
}
const DatePicker = forwardRef((props, ref) => {
    const { id, className, onSelect, targetDate, hold, minDate, maxDate, } = props;
    let { fromDate, toDate, } = props;
    if (isNil(minDate)) {
        throw new Error('minDate is a required field');
    }
    if (!isNil(fromDate) && !isNil(toDate) && toDate < fromDate) {
        // eslint-disable-next-line no-console
        console.error('ToDate cannot be less than fromDate');
        fromDate = null;
        toDate = null;
    }
    const infiniteListRef = useRef();
    const startDate = useMemo(() => {
        let startTarget = !isNil(fromDate) ? fromDate : new Date();
        if (startTarget < minDate) {
            startTarget = minDate;
        }
        else if (!isNil(maxDate) && maxDate < startTarget) {
            startTarget = maxDate;
        }
        const [year, month] = getDateArray(startTarget);
        return [year, month];
    }, []);
    const { minIndex, firstIndex, fullFirstDate, } = useMemo(() => {
        const [year, month, day] = getDateArray(minDate);
        return {
            minIndex: [year, 1],
            firstIndex: [year, month],
            fullFirstDate: [year, month, day],
        };
    }, [minDate]);
    const { lastIndex, maxIndex, fullLastDate, } = useMemo(() => {
        let year = null;
        let month = 12;
        let day = null;
        if (!isNil(maxDate)) {
            [year, month, day] = getDateArray(maxDate);
        }
        return {
            lastIndex: !isNil(year) ? [year, month] : null,
            maxIndex: [year, 12],
            fullLastDate: !isNil(day) ? [year, month, day] : null,
        };
    }, [maxDate]);
    useImperativeHandle(ref, () => ({
        gotoDate: (date) => {
            const [year, month] = getDateArray(date);
            let failed = false;
            if (year < firstIndex[0]) {
                failed = true;
            }
            else if (year === firstIndex[0] && month < firstIndex[1]) {
                failed = true;
            }
            else if (!isNil(lastIndex) && year > lastIndex[0]) {
                failed = true;
            }
            else if (!isNil(lastIndex) && year === lastIndex[0] && month > lastIndex[1]) {
                failed = true;
            }
            if (failed) {
                throw new Error('The gotoDate value must between minDate and maxDate inclusively');
            }
            infiniteListRef.current.gotoIndex([year, month]);
        },
    }));
    return (React.createElement(InfiniteList, { ref: infiniteListRef, id: id, className: classnames('ra-date-picker', className), loadCount: 10, bufferCount: 5, minIndex: minIndex, firstIndex: firstIndex, startingIndex: startDate, lastIndex: lastIndex, maxIndex: maxIndex, topOffset: true, hold: hold },
        React.createElement("div", { className: "ra-picker-week-header" },
            React.createElement("span", { className: "ra-picker-week-day" }, "Su"),
            React.createElement("span", { className: "ra-picker-week-day" }, "Mo"),
            React.createElement("span", { className: "ra-picker-week-day" }, "Tu"),
            React.createElement("span", { className: "ra-picker-week-day" }, "We"),
            React.createElement("span", { className: "ra-picker-week-day" }, "Th"),
            React.createElement("span", { className: "ra-picker-week-day" }, "Fr"),
            React.createElement("span", { className: "ra-picker-week-day" }, "Sa")),
        React.createElement(InfiniteListItems, { render: (_, [year, month]) => (React.createElement(PickerMonth, { id: buildId(id, `${year}-${month}`), month: month, year: year, firstDate: fullFirstDate, lastDate: fullLastDate, fromDate: fromDate, toDate: !isEqual(fromDate, toDate) ? toDate : null, onSelect: onSelect, targetDate: targetDate })) })));
});
DatePicker.displayName = 'DatePicker';
DatePicker.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    fromDate: PropTypes.instanceOf(Date),
    toDate: PropTypes.instanceOf(Date),
    targetDate: PropTypes.instanceOf(Date),
    onSelect: PropTypes.func,
    hold: PropTypes.bool,
    minDate: PropTypes.instanceOf(Date).isRequired,
    maxDate: PropTypes.instanceOf(Date),
};
DatePicker.defaultProps = {
    id: null,
    className: null,
    fromDate: null,
    toDate: null,
    onSelect: null,
    targetDate: null,
    hold: false,
    maxDate: null,
};

export { DatePicker as default };
