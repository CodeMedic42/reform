import React, { useMemo } from 'react';
import format from 'date-fns/format';
import isNil from 'lodash/isNil';
// import applyAnchorBinding from '../../controls/drop-down/anchor-binding';
import BaseMaskInput from '../base-input/base-mask-input';
import PropTypes from '../../../../common/prop-types';

const DATE_MASK = [
	/\d/,
	/\d/,
	' ',
	'/',
	' ',
	/\d/,
	/\d/,
	' ',
	'/',
	' ',
	/\d/,
	/\d/,
	/\d/,
	/\d/,
];

function DateInputBase(props) {
	const {
		value,
		...rest
	} = props;

	const date = useMemo(() => {
		if (isNil(value)) {
			return null;
		}

		return format(value, 'MM / dd / yyyy');
	}, [value]);

	return (
		<BaseMaskInput
			value={date}
			mask={DATE_MASK}
			placeholder="MM / DD / YYYY"
			autoComplete="off"
			guide
			keepCharPositions
			{...rest}
		/>
	);
}

DateInputBase.propTypes = {
	value: PropTypes.instanceOf(Date),
};

DateInputBase.defaultProps = {
	value: null,
};

export default DateInputBase;