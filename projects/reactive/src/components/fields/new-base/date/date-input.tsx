/* eslint-disable react/jsx-props-no-spreading */
import React, { memo, forwardRef, useCallback,
	// useMemo
} from 'react';
import { isNil } from 'lodash-es';
// import format from 'date-fns/format';
// import parse from 'date-fns/parse';
import MaskedInput from 'react-text-mask';
import classnames from 'classnames';

interface DateInputProps {
	className?: string | null;
	placeholder?: string;
	onChange: (value: string | null) => void;
	value?: string | null;
	fitTo?: string | null;
	[key: string]: unknown;
}

const DateInput = forwardRef<unknown, DateInputProps>((props, ref) => {
	const {
		onChange,
		value = null,
		placeholder = 'MM / DD / YYYY',
		className = null,
		fitTo = null,
		...rest
	} = props;

	const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const {
			target: { value: newValue },
		} = event;

		onChange(newValue.length > 0 ? newValue : null);
	}, [onChange]);

	const finalValue = !isNil(value) && value.length > 0 ? value : '';

	let text = '';

	if (fitTo === 'placeholder') {
		text = placeholder;
	} else if (fitTo === 'content') {
		text = finalValue.length > 0 ? finalValue : placeholder;
	} else if (!isNil(fitTo)) {
		text = fitTo;
	}

	return (
		<span className={classnames(className, 'ra-input-field', 'ra-date-field')} data-text={text}>
			<MaskedInput
				ref={ref}
				value={finalValue}
				onChange={handleChange}
				placeholder={placeholder}
				{...rest}
				size="1"
			/>
		</span>
	);
});

DateInput.displayName = 'StringInput';

export default memo(DateInput);
