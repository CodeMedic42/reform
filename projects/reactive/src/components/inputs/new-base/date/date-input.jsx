/* eslint-disable react/jsx-props-no-spreading */
import React, { memo, forwardRef, useCallback,
	// useMemo
} from 'react';
import isNil from 'lodash/isNil';
// import format from 'date-fns/format';
// import parse from 'date-fns/parse';
import MaskedInput from 'react-text-mask';
import classnames from 'classnames';
import PropTypes from '../../../../common/prop-types';

const DateInput = forwardRef((props, ref) => {
	const {
		onChange,
		value,
		placeholder,
		className,
		fitTo,
		...rest
	} = props;

	const handleChange = useCallback((event) => {
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

DateInput.propTypes = {
	className: PropTypes.string,
	placeholder: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.string,
	fitTo: PropTypes.string,
};

DateInput.defaultProps = {
	value: null,
	className: null,
	placeholder: 'MM / DD / YYYY',
	fitTo: null,
};

DateInput.displayName = 'StringInput';

export default memo(DateInput);
