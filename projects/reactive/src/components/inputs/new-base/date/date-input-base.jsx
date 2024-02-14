import React, { memo, useCallback, useMemo } from 'react';
import formatFnc from 'date-fns/format';
import toUpper from 'lodash/toUpper';
import parse from 'date-fns/parse';
import startOfToday from 'date-fns/startOfToday';
import isNil from 'lodash/isNil';
import reduce from 'lodash/reduce';
import includes from 'lodash/includes';
import PropTypes from '../../../../common/prop-types';
import InputValueBuffer from '../input-value-buffer';
import DateInput from './date-input';
import isInvalidDate from '../../../../common/is-invalid-date';

const INVALID_DATE = new Date(NaN);

function DateInputBase(props) {
	const {
		value,
		onChange,
		format,
		...rest
	} = props;

	const handleChange = useCallback((newValue) => {
		let finalValue = null;

		if (!isNil(newValue) && newValue.length > 0) {
			if (!includes(newValue, '_')) {
				finalValue = parse(newValue, format, startOfToday());

				if (isInvalidDate(finalValue)) {
					finalValue = INVALID_DATE;
				}
			} else {
				finalValue = INVALID_DATE;
			}
		}

		onChange(finalValue);
	}, [onChange, format]);

	const date = useMemo(() => {
		if (isInvalidDate(value)) {
			return null;
		}

		return formatFnc(value, format);
	}, [value, format]);

	const placeholder = useMemo(() => toUpper(format), [format]);

	const dateMask = useMemo(
		() => reduce(format, (acc, char) => {
			if (!isNil(char.match(/[a-zA-Z]/))) {
				acc.push(/\d/);
			} else {
				acc.push(char);
			}

			return acc;
		}, []),
		[format]
	);

	return (
		<InputValueBuffer
			value={date}
			onChange={handleChange}
		>
			{({ value: baseValue, onChange: baseOnChange }) => (
				<DateInput
					{...rest}
					value={baseValue}
					onChange={baseOnChange}
					type="text"
					mask={dateMask}
					placeholder={placeholder}
					autoComplete="off"
					guide
					keepCharPositions
					size="1"
				/>
			)}
		</InputValueBuffer>
	);
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

export default memo(DateInputBase);