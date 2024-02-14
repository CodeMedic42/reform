import isNil from 'lodash/isNil';

export function getDefaultSize(size) {
	return !isNil(size) ? size : 'md';
}

export function selectChipIconSize(isCircle, size) {
	const finalSize = getDefaultSize(size);

	if (isCircle) {
		if (finalSize === 'xs') {
			return {
				size: 'sm',
			};
		}

		if (finalSize === 'sm') {
			return {
				size: 'sm',
			};
		}

		if (finalSize === 'md') {
			return {
				size: 'md',
			};
		}

		if (finalSize === 'lg') {
			return {
				size: 'md',
			};
		}

		if (finalSize === 'xl') {
			return {
				size: 'xl',
			};
		}
	}

	if (!isCircle) {
		if (finalSize === 'xs') {
			return {
				size: 'xs',
			};
		}

		if (finalSize === 'sm') {
			return {
				size: 'xs',
			};
		}

		if (finalSize === 'md') {
			return {
				size: 'sm',
			};
		}

		if (finalSize === 'lg') {
			return {
				size: 'lg',
			};
		}

		if (finalSize === 'xl') {
			return {
				size: 'lg',
			};
		}
	}

	throw new Error('Invalid Size');
}
