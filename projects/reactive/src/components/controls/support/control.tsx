import React from 'react';
import classNames from 'classnames';

export type ControlProps<T extends React.ElementType = 'div'> = {
	className?: string;
	children: React.ReactNode;
	ControlComponent: T;
} & Omit<React.ComponentPropsWithoutRef<T>, 'className' | 'children'>;

function Control<T extends React.ElementType = 'div'>(props: ControlProps<T>) {
	const {
		className,
		children,
		ControlComponent,
		...rest
	} = props;

	return (
		React.createElement(
			ControlComponent,
			{
				className: classNames('re-control', className),
				...rest
			},
			children
		)
	);
}

export default Control;