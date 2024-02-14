import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import Tab from './tab';

function TabBar(props) {
    const {
        id: tabBarId,
        className,
        tabs,
        value,
        disabled: fullDisabled,
        onChange,
    } = props;

    if (isEmpty(tabs)) {
        return null;
    }

    return (
        <div
            id={tabBarId}
            className={classnames(
                'ra-tab-bar',
                className,
            )}
        >
            <div className={classnames('ra-tabs')}>
                {map(tabs, (tab) => {
                    const { id: tabId, heading, disabled } = tab;

                    return (
                        <Tab
                            id={tabBarId ? `${tabBarId}-${tabId}` : tabId}
                            tabId={tabId}
                            key={tabId}
                            disabled={fullDisabled || disabled}
                            active={value === tabId}
                            onClick={onChange}
                        >
                            {heading}
                        </Tab>
                    );
                })}
            </div>
        </div>
    );
}

TabBar.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            heading: PropTypes.node,
            disabled: PropTypes.bool,
        }),
    ),
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

export default TabBar;
