import React from 'react';
import classnames from 'classnames';
import '../../../common/prop-types.mjs';
import PropTypes from 'prop-types';

function PickerWeek(props) {
    const { 
    // beforeCount,
    // afterCount,
    children, passive, } = props;
    // const classNames = ['ra-picker-week'];
    // const style = {};
    // if (beforeCount > 0) {
    //     classNames.push('pad-before');
    //     style['--ra-picker-day-count'] = beforeCount;
    // } else if (afterCount > 0) {
    //     classNames.push('pad-after');
    //     style['--ra-picker-day-count'] = afterCount;
    // }
    return (React.createElement("div", { className: classnames('ra-picker-week', { passive }) }, children));
}
PickerWeek.propTypes = {
    children: PropTypes.children,
    passive: PropTypes.bool,
};
PickerWeek.defaultProps = {
    passive: false,
    children: null,
};

export { PickerWeek as default };
