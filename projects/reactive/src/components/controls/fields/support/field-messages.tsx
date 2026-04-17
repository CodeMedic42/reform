import React from 'react';
import classNames from "classnames";
import { map } from "lodash-es";

interface FieldMessagesProps {
	className?: string,
	messages?: string[],
}

function FieldMessages(props: FieldMessagesProps) {
	const {
		className,
		messages,
	} = props;

	return (
		<div className={classNames('re-field-messages', className)}>
			{map(messages, (message, index) => (
				<div key={index} className="re-field-message">
					<span>{message}</span>
				</div>
			))}
		</div>
	);	
}

export default FieldMessages;