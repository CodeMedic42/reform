import { isNil } from 'lodash-es';

function buildRequiredRule(message, optional) {
    return {
        validator: (fooValue) => {
            if (isNil(fooValue.getValue())) {
                return message;
            }
            return null;
        },
        ...optional
    };
}

export { buildRequiredRule as default };
