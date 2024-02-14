import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import reduce from 'lodash/reduce';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import buildId from '../../../common/build-id';

function buildMessageList(id, list, className) {
    const elements = reduce(
        list,
        (acc, generalMessage, index) => {
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
        <ul id={id} className={className}>
            {elements}
        </ul>
    );
}

function InputMessages(props) {
    const { id, className, messages } = props;

    if (isNil(messages)) {
        return null;
    }

    const { general, failure, success } = messages;

    // /buildId(id, '-general')}

    if (isEmpty(general) && isEmpty(failure) && isEmpty(success)) {
        return null;
    }

    return (
        <div id={id} className={classnames('ra-input-description', className)}>
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

InputMessages.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    messages: PropTypes.shape({
        general: PropTypes.arrayOf(PropTypes.string),
        success: PropTypes.arrayOf(PropTypes.string),
        failure: PropTypes.arrayOf(PropTypes.string),
    }),
};

InputMessages.defaultProps = {
    id: null,
    className: null,
    messages: null,
};

export default InputMessages;
