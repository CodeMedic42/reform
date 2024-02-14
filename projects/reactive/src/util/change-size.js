import clamp from 'lodash/clamp';
import reduce from 'lodash/reduce';

const sizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'];

const sizeIndexes = reduce(
	sizes,
	(acc, size, idx) => {
		acc[size] = idx;

		return acc;
	},
	{},
);

function changeSize(size, down = 1, increase = false) {
	const sizeIndex = sizeIndexes[size];
	const increment = increase ? down : down * -1;
	const newSizeIndex = clamp(sizeIndex + increment, 0, sizes.length - 1);

	return sizes[newSizeIndex];
}

export default changeSize;
