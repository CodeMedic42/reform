import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

function Tab(props) {
    const { id, className, tabId, active, disabled, children, onClick, } = props;
    const handleClick = useCallback(() => {
        onClick(tabId);
    }, [onClick, tabId]);
    const tabLabelId = `${id}-tab-label`;
    return (React.createElement("div", { className: classnames('ra-tab no-select', className, {
            active,
            disabled,
        }) },
        React.createElement("div", { id: tabLabelId, className: "ra-tab-label" }, children),
        React.createElement("button", { id: `${id}-tab-btn`, "aria-labelledby": tabLabelId, type: "button", className: "ra-tab-button no-select", disabled: disabled, onClick: handleClick })));
}
Tab.propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    tabId: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    onClick: PropTypes.func.isRequired,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
};
Tab.defaultProps = {
    className: null,
    children: null,
    disabled: false,
    active: false,
};

export { Tab as default };
