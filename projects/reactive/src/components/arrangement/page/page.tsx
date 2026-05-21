import React, { memo, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';

function initScrollbarListener() {
	const currentViewportWidth = null;
	const currentViewportHeight = null;

	function scrollbarHandler() {
		const documentClientWidth = document.documentElement.clientWidth;
		const documentClientHeight = document.documentElement.clientHeight;

		if (currentViewportWidth !== documentClientWidth) {
			document.documentElement.style.setProperty(
				'--doc-client-width',
				`${documentClientWidth}px`,
			);
		}

		if (currentViewportHeight !== documentClientHeight) {
			document.documentElement.style.setProperty(
				'--doc-client-height',
				`${documentClientHeight}px`,
			);
		}
	}

	scrollbarHandler();

	window.addEventListener('resize', scrollbarHandler);

	return scrollbarHandler;
}

const force = initScrollbarListener();

export interface PageProps {
	id?: string;
	className?: string;
	sticky?: boolean;
	children?: React.ReactNode;
}

function Page(props: PageProps): React.ReactElement {
	const { id, className, sticky, children } = props;

	const pageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		force();

		const resizeObserver = new ResizeObserver(force);
		const node = pageRef.current;

		if (!isNil(node)) {
			resizeObserver.observe(node);
		}

		return () => {
			if (!isNil(node)) {
				resizeObserver.unobserve(node);
			}
		};
	}, []);

	return (
		<div
			ref={pageRef}
			id={id}
			className={classnames('ra-page', className, {
				sticky,
			})}
		>
			<div className="ra-page-viewport">{children}</div>
		</div>
	);
}

export default memo(Page);
