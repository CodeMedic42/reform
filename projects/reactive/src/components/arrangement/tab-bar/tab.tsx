import React, { useCallback } from 'react';
import classnames from 'classnames';

export interface TabProps {
    id: string;
    className?: string | null;
    tabId: string;
    children?: React.ReactNode;
    onClick: (tabId: string) => void;
    active?: boolean;
    disabled?: boolean;
}

function Tab(props: TabProps): React.ReactElement {
    const {
        id,
        className,
        tabId,
        active = false,
        disabled = false,
        children,
        onClick,
    } = props;

    const handleClick = useCallback(() => {
        onClick(tabId);
    }, [onClick, tabId]);

    const tabLabelId = `${id}-tab-label`;

    return (
        <div
            className={classnames('ra-tab no-select', className, {
                active,
                disabled,
            })}
        >
            <div id={tabLabelId} className="ra-tab-label">
                {children}
            </div>
            <button
                id={`${id}-tab-btn`}
                aria-labelledby={tabLabelId}
                type="button"
                className="ra-tab-button no-select"
                disabled={disabled}
                onClick={handleClick}
            />
        </div>
    );
}

export default Tab;
