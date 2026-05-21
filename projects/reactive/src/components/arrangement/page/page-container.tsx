import React, { memo } from 'react';
import classnames from 'classnames';
import StickyContainer from '../sticky-container/sticky-container.js';

function PageContainer(props) {
	const {
		children,
		className,
		...rest
	} = props;

	return (
		<StickyContainer
			className={classnames('ra-page-container', className)}
			{...rest}
		>
			{children}
		</StickyContainer>
	);
}

export default memo(PageContainer);
