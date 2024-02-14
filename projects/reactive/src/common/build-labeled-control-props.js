import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';

export default function buildLabeledControlProps({
    id,
    label,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    messages,
}) {
    if (isNil(id)) {
        return null;
    }

    const inputId = `${id}-input`;
    let labelId = null;
    let labelledBy = '';

    if (!isEmpty(label)) {
        labelId = `${id}-label`;
        labelledBy = labelId;
    }

    if (!isEmpty(ariaLabelledBy)) {
        labelledBy = trim(`${ariaLabelledBy} ${labelledBy}`);
    }

    if (isEmpty(labelledBy)) {
        labelledBy = null;
    }

    const descriptionId = `${id}-description`;
    let describedBy = null;

    if (!isNil(ariaDescribedBy) && ariaDescribedBy.length > 0) {
        describedBy = `${ariaDescribedBy} ${descriptionId}`;
    } else if (messages) {
        describedBy = descriptionId;
    }

    return {
        inputId,
        labelId,
        descriptionId,
        labelledBy,
        describedBy,
        ariaLabel: !isEmpty(ariaLabel) ? ariaLabel : null,
    };
}
