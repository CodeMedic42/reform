import React, { memo, useCallback, useMemo } from 'react';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfToday from 'date-fns/startOfToday';
import { isNil, includes, toUpper, reduce } from 'lodash-es';
import '../../../../common/prop-types.mjs';
import InputValueBuffer from '../input-field-value-buffer.mjs';
import DateInput from './date-input.mjs';
import isInvalidDate from '../../../../common/is-invalid-date.mjs';
import PropTypes from 'prop-types';

const INVALID_DATE = new Date(NaN);
function DateInputBase(props) {
    const { value, onChange, format: format$1, ...rest } = props;
    const handleChange = useCallback((newValue) => {
        let finalValue = null;
        if (!isNil(newValue) && newValue.length > 0) {
            if (!includes(newValue, '_')) {
                finalValue = parse(newValue, format$1, startOfToday());
                if (isInvalidDate(finalValue)) {
                    finalValue = INVALID_DATE;
                }
            }
            else {
                finalValue = INVALID_DATE;
            }
        }
        onChange(finalValue);
    }, [onChange, format$1]);
    const date = useMemo(() => {
        if (isInvalidDate(value)) {
            return null;
        }
        return format(value, format$1);
    }, [value, format$1]);
    const placeholder = useMemo(() => toUpper(format$1), [format$1]);
    const dateMask = useMemo(() => reduce(format$1, (acc, char) => {
        if (!isNil(char.match(/[a-zA-Z]/))) {
            acc.push(/\d/);
        }
        else {
            acc.push(char);
        }
        return acc;
    }, []), [format$1]);
    return (React.createElement(InputValueBuffer, { value: date, onChange: handleChange }, ({ value: baseValue, onChange: baseOnChange }) => (React.createElement(DateInput, { ...rest, value: baseValue, onChange: baseOnChange, type: "text", mask: dateMask, placeholder: placeholder, autoComplete: "off", guide: true, keepCharPositions: true, size: "1" }))));
}
DateInputBase.propTypes = {
    format: PropTypes.string,
    value: PropTypes.instanceOf(Date),
    onChange: PropTypes.func,
};
DateInputBase.defaultProps = {
    format: 'MM / dd / yyyy',
    value: null,
    onChange: null,
};
var DateInputBase$1 = memo(DateInputBase);

export { DateInputBase$1 as default };
