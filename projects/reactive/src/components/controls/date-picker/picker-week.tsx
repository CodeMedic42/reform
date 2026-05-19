import React from 'react';
import classnames from 'classnames';

interface PickerWeekProps {
    children?: React.ReactNode;
    passive?: boolean;
}

function PickerWeek(props: PickerWeekProps): React.ReactNode {
    const {
        // beforeCount,
        // afterCount,
        children = null,
        passive = false,
    } = props;

    // const classNames = ['ra-picker-week'];
    // const style = {};

    // if (beforeCount > 0) {
    //     classNames.push('pad-before');
    //     style['--ra-picker-day-count'] = beforeCount;
    // } else if (afterCount > 0) {
    //     classNames.push('pad-after');
    //     style['--ra-picker-day-count'] = afterCount;
    // }

    return (
        <div
            className={classnames('ra-picker-week', { passive })}
            // className={classnames(classNames)}
            // style={style}
        >
            {children}
        </div>
    );
}

export default PickerWeek;
