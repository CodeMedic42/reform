import { clamp, reduce } from 'lodash-es';

const sizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'] as const;

export type Size = typeof sizes[number];

const sizeIndexes = reduce(
	sizes,
	(acc: Record<string, number>, size, idx) => {
		acc[size] = idx;

		return acc;
	},
	{},
);

function changeSize(size: string, down = 1, increase = false): string {
	const sizeIndex = sizeIndexes[size];
	const increment = increase ? down : down * -1;
	const newSizeIndex = clamp(sizeIndex + increment, 0, sizes.length - 1);

	return sizes[newSizeIndex];
}

export default changeSize;
