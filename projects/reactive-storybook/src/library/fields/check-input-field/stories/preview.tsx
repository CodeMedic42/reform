import React, { useState, useMemo } from 'react';
import { reduce } from 'lodash-es';
import CheckInputField from '@reformjs/reactive/fields/check-input-field';

function generateMessages(count: number = 0): string[] {
	const messages: string[] = [];

	for (let counter = 0; counter < count; counter += 1) {
		messages.push(`Message Number ${counter + 1}`);
	}

	return messages;
}

interface PreviewProps {
	successMessageCount: number;
	failureMessageCount: number;
	generalMessageCount: number;
	[key: string]: unknown;
}

function Preview(props: PreviewProps) {
	const [value, setValue] = useState<boolean>(false);

	const {
		successMessageCount,
		failureMessageCount,
		generalMessageCount,
		...rest
	} = props;

	const successMessages = useMemo(
		() => generateMessages(successMessageCount),
		[successMessageCount],
	);
	const failureMessages = useMemo(
		() => generateMessages(failureMessageCount),
		[failureMessageCount],
	);
	const generalMessages = useMemo(
		() => generateMessages(generalMessageCount),
		[generalMessageCount],
	);
	const messages = useMemo(() => {
		if (
			successMessages.length <= 0 &&
			failureMessages.length <= 0 &&
			generalMessages.length <= 0
		) {
			return null;
		}

		const mess: Record<string, string[]> = {};

		if (successMessages.length > 0) {
			mess.success = successMessages;
		}

		if (failureMessages.length > 0) {
			mess.failure = failureMessages;
		}

		if (generalMessages.length > 0) {
			mess.general = generalMessages;
		}

		return mess;
	}, [successMessages, failureMessages, generalMessages]);

	const extraProps = {
		...reduce(
			rest,
			(acc: Record<string, unknown>, prop: unknown, key: string) => {
				if (prop === 'true') {
					acc[key] = true;
				} else if (prop === 'false') {
					acc[key] = false;
				} else {
					acc[key] = prop;
				}

				return acc;
			},
			{},
		),
		value,
		onChange: setValue,
		messages,
		label: 'Foo'
	};

	return (
		<>
			<CheckInputField
				{...(extraProps as any)}
			/>
			<div><span>{`Value: ${value}`}</span></div>
		</>
	);
}

Preview.storyName = 'Preview';
Preview.parameters = {
	options: {
		showPanel: true,
	},
};
Preview.argTypes = {
	id: {
		control: 'text',
	},
	className: {
		control: 'text',
	},
	label: {
		control: 'text',
	},
	title: {
		control: 'text',
	},
	'aria-label': {
		control: 'text',
	},
	variant: {
		control: 'select',
		options: ['check', 'indeterminate'],
		defaultValue: 'check',
	},
	color: {
		control: 'select',
		options: [
			'primary',
			'secondary',
			'info',
			'success',
			'warn',
			'danger',
			'purple',
			'navy',
			'blue',
			'cyan',
			'green',
			'yellow',
			'orange',
			'red',
			'grey',
		],
		defaultValue: 'primary',
	},
	size: {
		control: 'select',
		options: ['sm', 'md', 'lg'],
		defaultValue: 'md',
	},
	disabled: {
		control: 'boolean',
		defaultValue: false,
	},
	hidden: {
		control: 'boolean',
		defaultValue: false,
	},
	ignoreHalo: {
		control: 'boolean',
		defaultValue: false,
	},
	constrictField: {
		control: 'boolean',
		defaultValue: false,
	},
	successMessageCount: {
		control: 'number',
	},
	failureMessageCount: {
		control: 'number',
	},
	generalMessageCount: {
		control: 'number',
	},
	onChange: { table: { disable: true } },
	onClick: { table: { disable: true } },
};

export default Preview;
