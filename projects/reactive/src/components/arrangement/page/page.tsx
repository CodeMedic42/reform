import React, { memo, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';

export interface PageProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'style'> {
	disableAdjustment?: boolean;
	style?: React.CSSProperties & {
		'--page-top-panel-height'?: string;
		'--page-bottom-panel-height'?: string;
		'--page-left-panel-width'?: string;
		'--page-right-panel-width'?: string;
		'--gutter-width'?: string;
	};
}

function Page(props: PageProps): React.ReactElement {
	const {
		id,
		className,
		children,
		disableAdjustment,
		...rest
	} = props;

	const pageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (disableAdjustment) {
			return undefined;
		}

		let currentViewportWidth: number = 0;
		let currentViewportHeight: number = 0;

		function setClientLengths() {
			const documentClientWidth = document.documentElement.clientWidth;
			const documentClientHeight = document.documentElement.clientHeight;

			if (currentViewportWidth !== documentClientWidth) {
				document.documentElement.style.setProperty(
					'--doc-client-width',
					`${documentClientWidth}px`,
				);

				currentViewportWidth = documentClientWidth;
			}

			if (currentViewportHeight !== documentClientHeight) {
				document.documentElement.style.setProperty(
					'--doc-client-height',
					`${documentClientHeight}px`,
				);

				currentViewportHeight = documentClientHeight;
			}
		}
		
		setClientLengths();

		if (!isNil(window)) {
			window.addEventListener('resize', setClientLengths);
		}

		const resizeObserver = new ResizeObserver(setClientLengths);
		const node = pageRef.current;

		if (!isNil(node)) {
			resizeObserver.observe(node);
		}

		return () => {
			if (!isNil(node)) {
				resizeObserver.unobserve(node);
			}

			if (!isNil(window)) {
				window.removeEventListener('resize', setClientLengths);
			}
		};
	}, []);

	return (
		<div
			ref={pageRef}
			id={id}
			className={classnames('ra-page', className)}
			{...rest}
		>
			<div className="ra-page-viewport">{children}</div>
		</div>
	);
}

export default memo(Page);
