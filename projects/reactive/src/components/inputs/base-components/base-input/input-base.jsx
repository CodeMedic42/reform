/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';
import toString from 'lodash/toString';

const InputBase = forwardRef((props, ref) => {
	const {
		onChange,
		value,
		forwardedRef,
		Component,
		...rest
	} = props;

	const handleChange = useCallback((event) => {
		const {
			target: { value: newValue },
		} = event;

		onChange(newValue.length > 0 ? newValue : null);
	}, [onChange]);

	return (
		<Component
			ref={ref}
			value={!isNil(value) ? toString(value) : ''}
			onChange={handleChange}
			{...rest}
		/>
	);
});

InputBase.propTypes = {
	onChange: PropTypes.func.isRequired,
	value: PropTypes.string,
	// eslint-disable-next-line react/forbid-prop-types
	forwardedRef: PropTypes.object,
	// eslint-disable-next-line react/forbid-prop-types
	Component: PropTypes.any.isRequired,
};

InputBase.defaultProps = {
	forwardedRef: null,
	value: null,
};

InputBase.displayName = 'InputBase';

export default InputBase;
