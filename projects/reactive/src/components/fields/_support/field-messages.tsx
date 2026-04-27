import React from 'react';
import classnames from 'classnames';
import { reduce, isNil, isEmpty } from 'lodash-es';
import buildId from '../../../common/build-id.js';

export type { FieldMessageData } from '../../../common/prop-types.js';
import type { FieldMessageData } from '../../../common/prop-types.js';

interface FieldMessagesProps {
    id?: string | null;
    className?: string | null;
    messages?: FieldMessageData | null;
}

function buildMessageList(id: string | null | undefined, list: string[] | undefined, className: string): React.ReactNode {
    const elements = reduce(
        list,
        (acc: React.ReactElement[], generalMessage: string, index: number) => {
            if (!isNil(generalMessage)) {
                acc.push(<li key={index}>{generalMessage}</li>);
            }

            return acc;
        },
        [],
    );

    if (elements.length <= 0) {
        return null;
    }

    return (
        <ul id={id ?? undefined} className={className}>
            {elements}
        </ul>
    );
}

function FieldMessages(props: FieldMessagesProps): React.ReactElement | null {
    const { id = null, className = null, messages = null } = props;

    if (isNil(messages)) {
        return null;
    }

    const { general, failure, success } = messages;

    // /buildId(id, '-general')}

    if (isEmpty(general) && isEmpty(failure) && isEmpty(success)) {
        return null;
    }

    return (
        <div id={id ?? undefined} className={classnames('ra-input-description', className)}>
            {buildMessageList(
                buildId(id, 'general'),
                general,
                'general-messages',
            )}
            {buildMessageList(
                buildId(id, 'success'),
                success,
                'success-messages',
            )}
            {buildMessageList(
                buildId(id, 'failure'),
                failure,
                'failure-messages',
            )}
        </div>
    );
}

export default FieldMessages;
