/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import reduce from 'lodash/reduce';
import SelectInput from '@reformjs/reactive/inputs/select-input';
import { abbreviated } from '../../../../common/options-data';

function generateMessages(count = 0) {
    const messages = [];

    for (let counter = 0; counter < count; counter += 1) {
        messages.push(`Message Number ${counter + 1}`);
    }

    return messages;
}

function Preview(props) {
    const [value, setValue] = useState(null);

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

    return (
        <SelectInput
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
            options={abbreviated}
            value={value || 'appleCrumb'}
            onChange={setValue}
            messages={messages}
        />
    );
}

Preview.propTypes = {
    successMessageCount: PropTypes.number,
    failureMessageCount: PropTypes.number,
    generalMessageCount: PropTypes.number,
};

Preview.defaultProps = {
    successMessageCount: 0,
    failureMessageCount: 0,
    generalMessageCount: 0,
};

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
