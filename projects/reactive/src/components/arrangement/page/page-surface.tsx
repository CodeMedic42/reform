import React, { memo } from 'react';
import classnames from 'classnames';

export type PageSurfacePosition = 'top' | 'bottom' | 'left' | 'right';

export interface PageSurfaceProps extends React.ComponentPropsWithoutRef<'div'> {
	position: PageSurfacePosition;
}

function PageSurface(props: PageSurfaceProps): React.ReactElement {
	const {
		children,
		className,
		position,
		...rest
	} = props;

	return (
		<div
			className={classnames('ra-page-surface', `position-${position}`, className)}
			{...rest}
		>
			{children}
		</div>
	);
}

export default memo(PageSurface);
