import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { isEmpty, map } from 'lodash-es';
import Tab from './tab.mjs';

function TabBar(props) {
    const { id: tabBarId, className, tabs, value, disabled: fullDisabled, onChange, } = props;
    if (isEmpty(tabs)) {
        return null;
    }
    return (React.createElement("div", { id: tabBarId, className: classnames('ra-tab-bar', className) },
        React.createElement("div", { className: classnames('ra-tabs') }, map(tabs, (tab) => {
            const { id: tabId, heading, disabled } = tab;
            return (React.createElement(Tab, { id: tabBarId ? `${tabBarId}-${tabId}` : tabId, tabId: tabId, key: tabId, disabled: fullDisabled || disabled, active: value === tabId, onClick: onChange }, heading));
        }))));
}
TabBar.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    tabs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        heading: PropTypes.node,
        disabled: PropTypes.bool,
    })),
    value: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
};
TabBar.defaultProps = {
    id: null,
    className: null,
    value: null,
    tabs: null,
    disabled: false,
    onChange: null,
};

export { TabBar as default };
