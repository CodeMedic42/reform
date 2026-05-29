import React, { memo } from 'react';
import classnames from 'classnames';
import StickyContainer, { type StickyContainerProps } from '../sticky-container/sticky-container.js';

export type PageContentProps = StickyContainerProps;

function PageContent(props: PageContentProps): React.ReactElement {
	const {
		children,
		className,
		...rest
	} = props;

	return (
		<StickyContainer
			className={classnames('ra-page-content', className)}
			{...rest}
		>
			{children}
		</StickyContainer>
	);
}

export default memo(PageContent);
