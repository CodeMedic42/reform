import React, { Children, isValidElement, useCallback, useState } from 'react';
import classnames from 'classnames';
import Tab, { TabGroupContext, TabGroupContextValue, TabProps } from './tab.js';
import Card from '../card/card.js';
import isNil from 'lodash-es/isNil.js';

export interface TabGroupProps {
    id?: string | null;
    className?: string | null;
    disabled?: boolean;
    onChange?: ((tabId: string) => void) | null;
    children?: React.ReactNode;
}

function TabGroup(props: TabGroupProps): React.ReactElement | null {
    const {
        id: groupId,
        className,
        disabled: groupDisabled = false,
        onChange,
        children,
    } = props;

    const [selectedTab, setSelectedTab] = useState<string | null>(null);

    const handleClick = useCallback((tabId: string) => {
        setSelectedTab(tabId);

        if (onChange) {
            onChange(tabId);
        }
    }, [onChange]);

    const tabs: React.ReactElement<TabProps>[] = [];
    let effectiveSelectedTab: string | null = selectedTab;
    const seenIds = new Set<string>();
    let duplicateWarned = false;

    Children.forEach(children, (child) => {
        if (!isValidElement(child) || child.type !== Tab) {
            return;
        }

        const tabChild = child as React.ReactElement<TabProps>;
        const tabId = tabChild.props.id;

        if (seenIds.has(tabId) && !duplicateWarned) {
            console.error('Multiple tabs with the same id found. This is not supported.');
            duplicateWarned = true;
        }
        seenIds.add(tabId);

        tabs.push(tabChild);

        if (isNil(effectiveSelectedTab)) {
            effectiveSelectedTab = tabId;
        }
    });

    if (tabs.length === 0) {
        return null;
    }

    const content: React.ReactElement[] = [];

    tabs.forEach((tab) => {
        const { id: tabId, children: panel } = tab.props;

        if (isNil(panel)) {
            return;
        }

        const hidden = effectiveSelectedTab !== tabId;

        content.push(
            <Card
                key={tabId}
                className={classnames('ra-tab-panel', { hidden })}
            >
                {panel}
            </Card>,
        );
    });

    const contextValue: TabGroupContextValue = {
        groupId,
        selectedTabId: effectiveSelectedTab,
        groupDisabled,
        onSelect: handleClick,
    };

    return (
        <TabGroupContext.Provider value={contextValue}>
            <div
                id={groupId ?? undefined}
                className={classnames('ra-tab-bar', className)}
            >
                <div className="ra-tabs">
                    {Children.map(children, (child) => (
                        isValidElement(child) && child.type === Tab ? child : null
                    ))}
                </div>
            </div>
            {content.length > 0 ? content : null}
        </TabGroupContext.Provider>
    );
}

export default TabGroup;
