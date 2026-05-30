import React from 'react';

type ButtonColor = 'primary' | 'secondary' | 'info' | 'success' | 'warn' | 'danger' | (string & {});
type ButtonDesign = 'sm' | 'lg-long' | (string & {});
type ButtonVariant = 'fill' | (string & {});

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
	className?: string;
	Component?: React.ElementType;
	color?: ButtonColor;
	design?: ButtonDesign;
	variant?: ButtonVariant;
	children?: React.ReactNode;
	focusOnMount?: boolean;
}
