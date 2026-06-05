import React, { useCallback, useContext } from 'react';
import classnames from 'classnames';

export interface TabProps {
    id: string;
    heading?: React.ReactNode;
    disabled?: boolean;
    children?: React.ReactNode;
}

export interface TabGroupContextValue {
    groupId?: string | null;
    selectedTabId: string | null;
    groupDisabled: boolean;
    onSelect: (tabId: string) => void;
}

export const TabGroupContext = React.createContext<TabGroupContextValue | null>(null);

function Tab(props: TabProps): React.ReactElement | null {
    const { id, heading, disabled = false } = props;
    const ctx = useContext(TabGroupContext);

    const handleClick = useCallback(() => {
        if (ctx) {
            ctx.onSelect(id);
        }
    }, [ctx, id]);

    if (!ctx) {
        return null;
    }

    const active = ctx.selectedTabId === id;
    const effectiveDisabled = ctx.groupDisabled || disabled;
    const headerId = ctx.groupId ? `${ctx.groupId}-${id}` : id;
    const tabLabelId = `${headerId}-tab-label`;

    return (
        <div
            className={classnames('ra-tab no-select', {
                active,
                disabled: effectiveDisabled,
            })}
        >
            <div id={tabLabelId} className="ra-tab-label">
                {heading}
            </div>
            <button
                id={`${headerId}-tab-btn`}
                aria-labelledby={tabLabelId}
                type="button"
                className="ra-tab-button no-select"
                disabled={effectiveDisabled}
                onClick={handleClick}
            />
        </div>
    );
}

export default Tab;
