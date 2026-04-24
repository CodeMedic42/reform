import React from 'react';

type ButtonColor = 'primary' | 'secondary' | 'info' | 'success' | 'warn' | 'danger' | (string & {});
type ButtonDesign = 'fill' | (string & {});
type ButtonVariant = 'sm' | 'lg-long' | (string & {});

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
	className?: string;
	Component?: React.ElementType;
	color?: ButtonColor;
	design?: ButtonDesign;
	variant?: ButtonVariant;
	children?: React.ReactNode;
	focusOnMount?: boolean;
}
