import { isNil, isEmpty, trim } from 'lodash-es';

export interface InputMessages {
    general?: string[];
    success?: string[];
    failure?: string[];
}

interface BuildLabeledControlPropsInput {
    id: string | null | undefined;
    label?: string | null;
    'aria-label'?: string | null;
    'aria-labelledby'?: string | null;
    'aria-describedby'?: string | null;
    messages?: InputMessages | null;
}

interface BuildLabeledControlPropsOutput {
    inputId: string;
    labelId: string | null;
    descriptionId: string;
    labelledBy: string | null;
    describedBy: string | null;
    ariaLabel: string | null;
}

export default function buildLabeledControlProps({
    id,
    label,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    messages,
}: BuildLabeledControlPropsInput): BuildLabeledControlPropsOutput | null {
    if (isNil(id)) {
        return null;
    }

    const inputId = `${id}-input`;
    let labelId: string | null = null;
    let labelledBy: string | null = '';

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
    let describedBy: string | null = null;

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
        ariaLabel: !isEmpty(ariaLabel) ? ariaLabel! : null,
    };
}
