import { isNil } from 'lodash-es';

export default function buildId(id, additional) {
	if (isNil(id) || id.length <= 0) {
		return null;
	}

	return `${id}-${additional}`;
}
