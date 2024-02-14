import React from 'react';
import classnames from 'classnames';
import PropTypes from '../../../common/prop-types';

function PickerWeek(props) {
    const {
        // beforeCount,
        // afterCount,
        children,
        passive,
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

PickerWeek.propTypes = {
    children: PropTypes.children,
    passive: PropTypes.bool,
};

PickerWeek.defaultProps = {
    passive: false,
    children: null,
};

export default PickerWeek;