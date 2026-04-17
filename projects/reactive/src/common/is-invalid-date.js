import { isNil, isNaN } from 'lodash-es';

function isInvalidDate(value) {
	return isNil(value) || isNaN(value.getTime());
}

export default isInvalidDate;
