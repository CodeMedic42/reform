import React from 'react';
import classnames from 'classnames';
import StickyContainer from '../sticky-container/sticky-container.js';

function Card(props) {
	const {
		className,
		children,
		...rest
	} = props;

	return (
		<StickyContainer
			className={classnames('ra-card', className)}
			{...rest}
		>
			{children}
		</StickyContainer>
	);
}

export default Card;
