import isNil from 'lodash/isNil';
import isNaN from 'lodash/isNaN';

function isInvalidDate(value) {
	return isNil(value) || isNaN(value.getTime());
}

export default isInvalidDate;
