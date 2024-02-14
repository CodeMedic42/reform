import classnames from 'classnames';

export default function hiddenBuilder(reflexSizes: boolean[], condition = true): string {
    if (condition === false) {
        return '';
    }

    let wasEnabled = reflexSizes[0] === true;
    const classNames = [];

    for (let counter = 1; counter < reflexSizes.length; counter += 1) {
        const enabled = reflexSizes[counter];

        if (enabled) {
            if (!wasEnabled) {
                classNames.push(`hidden-gt-bp${counter}`);

                wasEnabled = true;
            }
        } else if (wasEnabled) {
            classNames.push(`hidden-lt-bp${counter}`);

            wasEnabled = false;
        }
    }

    if (classNames.length <= 0) {
        return 'hidden';
    }

    return classnames(...classNames);
}
