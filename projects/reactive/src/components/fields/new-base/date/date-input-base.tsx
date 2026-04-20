import React, { memo, useCallback, useMemo } from 'react';
import formatFnc from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfToday from 'date-fns/startOfToday';
/* eslint-enable import/no-duplicates */
import { toUpper, isNil, reduce, includes } from 'lodash-es';
import InputValueBuffer from '../input-field-value-buffer.js';
import DateInput from './date-input.js';
import isInvalidDate from '../../../../common/is-invalid-date.js';

const INVALID_DATE = new Date(NaN);

interface DateInputBaseProps {
	format?: string;
	value?: Date | null;
	onChange?: ((value: Date | null) => void) | null;
	id?: string | null;
	className?: string | null;
	title?: string | null;
	name?: string | null;
	size?: string | null;
	required?: boolean;
	disabled?: boolean;
	'aria-labelledby'?: string | null;
	'aria-describedby'?: string | null;
	'aria-label'?: string | null;
	onFocus?: (() => void) | null;
	fitTo?: string | null;
}

function DateInputBase(props: DateInputBaseProps): React.ReactElement {
	const {
		value = null,
		onChange = null,
		format = 'MM / dd / yyyy',
		...rest
	} = props;

	const handleChange = useCallback((newValue: string | number | null) => {
		let finalValue: Date | null = null;

		if (!isNil(newValue) && (newValue as string).length > 0) {
			if (!includes(newValue as string, '_')) {
				finalValue = parse(newValue as string, format, startOfToday());

				if (isInvalidDate(finalValue)) {
					finalValue = INVALID_DATE;
				}
			} else {
				finalValue = INVALID_DATE;
			}
		}

		if (onChange) {
			onChange(finalValue);
		}
	}, [onChange, format]);

	const date = useMemo(() => {
		if (isInvalidDate(value)) {
			return null;
		}

		return formatFnc(value!, format);
	}, [value, format]);

	const placeholder = useMemo(() => toUpper(format), [format]);

	const dateMask = useMemo(
		() => reduce(format as unknown as string[], (acc: Array<string | RegExp>, char: string) => {
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
			{({ value: baseValue, onChange: baseOnChange }: { value: string | number | null; onChange: (value: string | number | null) => void }) => (
				<DateInput
					{...rest}
					value={baseValue as string | null}
					onChange={baseOnChange as unknown as (value: string | null) => void}
					type="text"
					mask={dateMask}
					placeholder={placeholder}
					autoComplete="off"
					guide
					keepCharPositions
					size={1}
				/>
			)}
		</InputValueBuffer>
	);
}

export default memo(DateInputBase);
