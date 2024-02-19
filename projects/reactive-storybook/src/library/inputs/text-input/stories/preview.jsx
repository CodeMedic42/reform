/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo } from 'react';
import reduce from 'lodash/reduce';
import TextInput from '@reformjs/reactive/inputs/text-input';
// import { faFaceLaughSquint } from '@audacious/icons/regular/faFaceLaughSquint';
// import { faFaceLaughBeam } from '@audacious/icons/regular/faFaceLaughBeam';


function generateMessages(count = 0) {
	const messages = [];

	for (let counter = 0; counter < count; counter += 1) {
		messages.push(`Message Number ${counter + 1}`);
	}

	return messages;
}

function example(props) {
	const [value, setValue] = useState(null);

	const {
		successMessageCount,
		failureMessageCount,
		generalMessageCount,
		useLeftIcon,
		useRightIcon,
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

		const mess = {};

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

	// const leftIcon = useLeftIcon ? { icon: faFaceLaughBeam } : null;
	// const rightIcon = useRightIcon ? { icon: faFaceLaughSquint } : null;

	return (
		// <Scope fillViewport>
			<TextInput
				{...reduce(
					rest,
					(acc, prop, key) => {
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
				)}
				value={value}
				onChange={setValue}
				messages={messages}
				leftAnnotation={<span>Foo</span>}
				rightAnnotation={<span>Bar</span>}
				// leftIcon={leftIcon}
				// rightIcon={rightIcon}
			/>
		// </Scope>
	);
}

example.story = {
	name: 'Preview',
	parameters: {
		options: {
			showPanel: true,
		},
	},
	argTypes: {
		id: {
			control: 'text',
		},
		className: {
			control: 'text',
		},
		placeholder: {
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
		disabled: {
			control: 'boolean',
			defaultValue: false,
		},
		secure: {
			control: 'boolean',
			defaultValue: false,
		},
		failure: {
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
		minLength: {
			control: 'number',
		},
		maxLength: {
			control: 'number',
		},
		required: {
			control: 'boolean',
			defaultValue: false,
		},
		hidden: {
			control: 'boolean',
			defaultValue: false,
		},
		pattern: {
			control: 'text',
		},
		variant: {
			control: 'text',
		},
		focusOnMount: {
			control: 'boolean',
			defaultValue: false,
		},
		onFocus: { table: { disable: true } },
		onBlur: { table: { disable: true } },
		onKeyPress: { table: { disable: true } },
		onKeyDown: { table: { disable: true } },
		onKeyUp: { table: { disable: true } },
		autoComplete: {
			control: 'select',
			options: ['on', 'off'],
			defaultValue: 'off',
		},
		showFocused: {
			control: 'boolean',
			defaultValue: false,
		},
		// useLeftIcon: {
		// 	control: 'boolean',
		// 	defaultValue: false,
		// },
		// useRightIcon: {
		// 	control: 'boolean',
		// 	defaultValue: false,
		// },
	},
};

export default example;
