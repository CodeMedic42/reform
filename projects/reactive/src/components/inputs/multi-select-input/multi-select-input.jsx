import React, { useCallback, forwardRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import clone from 'lodash/clone';
import pullAt from 'lodash/pullAt';
import Select, {
	propTypes as selectPropTypes,
	defaultProps as selectDefaultProps,
} from '../base-components/select';
import MultiSelectAnchor from './multi-select-anchor';

const MultiSelectInput = forwardRef((props, ref) => {
	const {
		className,
		expandable,
		onChange,
		value,
		nullable,
		...rest
	} = props;

    const handleClear = useCallback(() => {
        onChange(null);
    }, [ onChange ]);

	const handleClearIndex = useCallback(({ index }) => {
        if (isNil(onChange)) {
            return;
        }

        let newValue = clone(value);

        pullAt(newValue, [index]);

        if (newValue.length <= 0) {
            newValue = null;
        }

        onChange(newValue);
    }, [value, onChange]);

	return (
		<Select
			enableFiltering
			{...rest}
			ref={ref}
			className={classnames(
				'ra-select-input',
				'ra-multi-select',
				className,
				{
					expandable,
				},
			)}
			Anchor={MultiSelectAnchor}
            anchorProps={{
                onClear: handleClear,
				onClearIndex: handleClearIndex,
				nullable,
            }}
			useFilter
			isMultiSelect
			onSelect={onChange}
		/>
	);
});

MultiSelectInput.propTypes = {
	...selectPropTypes,
	value: PropTypes.arrayOf(
		PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	),
	expandable: PropTypes.bool,
	onChange: PropTypes.func,
	nullable: PropTypes.bool,
};

MultiSelectInput.defaultProps = {
	...selectDefaultProps,
	value: null,
	expandable: false,
	onChange: null,
	nullable: false,
};

export default MultiSelectInput;
