/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef, useCallback } from 'react';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import PropTypes from '../../../common/prop-types';

const StringInput = forwardRef((props, ref) => {
	const {
		onChange,
		value,
		Component,
		className,
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
			{...rest}
			ref={ref}
			className={classnames('ra-input-field', 'ra-text-field', className)}
			value={!isNil(value) ? value : ''}
			onChange={handleChange}
		/>
	);
});

StringInput.propTypes = {
	className: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.string,
	// eslint-disable-next-line react/forbid-prop-types
	// eslint-disable-next-line react/forbid-prop-types
	Component: PropTypes.Component.isRequired,
};

StringInput.defaultProps = {
	value: null,
	className: null,
};

StringInput.displayName = 'StringInput';

export default StringInput;
