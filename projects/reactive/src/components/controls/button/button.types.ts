import React from 'react';

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
	className?: string;
	Component?: React.ElementType;
	color?: string;
	design?: string;
	variant?: string;
	children?: React.ReactNode;
	focusOnMount?: boolean;
}
