/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef, useCallback } from 'react';
import isNil from 'lodash/isNil';
import PropTypes from '../../../common/prop-types';

function getNumericValue(value) {
	if (isNil(value)) {
		return '';
	}

	if (isNaN(value)) {
		return '';
	}

	return toString(value);
}

const NumericInput = forwardRef((props, ref) => {
	const {
		onChange,
		value,
		Component,
		...rest
	} = props;

	const handleChange = useCallback((event) => {
		const {
			target: { value: newValue, valueAsNumber, validity },
		} = event;

		onChange(validity.badInput || newValue.length > 0 ? valueAsNumber : null);
	}, [onChange]);

	return (
		<Component
			ref={ref}
			value={getNumericValue(value)}
			onChange={handleChange}
			{...rest}
		/>
	);
});

NumericInput.propTypes = {
	onChange: PropTypes.func.isRequired,
	value: PropTypes.string,
	// eslint-disable-next-line react/forbid-prop-types
	// eslint-disable-next-line react/forbid-prop-types
	Component: PropTypes.Component.isRequired,
};

NumericInput.defaultProps = {
	value: null,
};

NumericInput.displayName = 'StringInput';

export default NumericInput;
