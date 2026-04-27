import React, { useState, useMemo } from 'react';
import { reduce } from 'lodash-es';
import MultiSelectInputField from '@reformjs/reactive/fields/multi-select-input-field';
import { abbreviated } from '../../../../common/options-data';

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
    const [value, setValue] = useState<string | number | null>(null);

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
            successMessages.length <= 0
            && failureMessages.length <= 0
            && generalMessages.length <= 0
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
        options: abbreviated,
        value: value || 'appleCrumb',
        onChange: setValue,
        messages,
    };

    return (
        <MultiSelectInputField
            {...(extraProps as any)}
        />
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
    placeholder: {
        control: 'text',
    },
    label: {
        control: 'text',
    },
    value: { table: { disable: true } },
    title: {
        control: 'text',
    },
    'aria-label': {
        control: 'text',
    },
    nullable: {
        control: 'boolean',
        defaultValue: true,
    },
    enableFiltering: {
        control: 'select',
        options: ['internal', 'external', false],
        defaultValue: 'internal',
    },
    minFilterChar: {
        control: 'number',
        if: { arg: 'enableFiltering', truthy: true },
        defaultValue: 1,
    },
    enableCustomValues: {
        control: 'boolean',
        defaultValue: false,
        if: { arg: 'enableFiltering', truthy: true },
    },
    emptyFilterMessage: {
        control: 'text',
        if: { arg: 'enableFiltering', truthy: true },
    },
    isFiltering: {
        control: 'boolean',
        defaultValue: false,
        if: { arg: 'enableFiltering', truthy: true },
    },
    isFilteringMessage: {
        control: 'text',
        if: { arg: 'enableFiltering', truthy: true },
    },
    onFilter: { table: { disable: true } },

    disabled: {
        control: 'boolean',
        defaultValue: false,
    },
    hideSelected: {
        control: 'boolean',
        defaultValue: false,
    },
    noOptionsMessage: {
        control: 'text',
    },
    useFilterMessage: {
        control: 'text',
    },
    enableSort: {
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
    hidden: {
        control: 'boolean',
        defaultValue: false,
    },
    size: {
        control: 'select',
        options: ['sm', 'md', 'lg'],
        defaultValue: 'md',
    },
};

export default Preview;
