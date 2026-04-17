import { isNil } from 'lodash-es';

export default function buildId(id: string | null | undefined, additional: string): string | null {
	if (isNil(id) || id.length <= 0) {
		return null;
	}

	return `${id}-${additional}`;
}
