import React from 'react';
import classnames from 'classnames';
import { map, isEmpty } from 'lodash-es';
import Tab from './tab.js';

export interface TabItem {
    id: string;
    heading?: React.ReactNode;
    disabled?: boolean;
}

export interface TabBarProps {
    id?: string | null;
    className?: string | null;
    tabs?: TabItem[] | null;
    value?: string | null;
    disabled?: boolean;
    onChange?: ((tabId: string) => void) | null;
}

function TabBar(props: TabBarProps): React.ReactElement | null {
    const {
        id: tabBarId,
        className,
        tabs,
        value,
        disabled: fullDisabled = false,
        onChange,
    } = props;

    if (isEmpty(tabs)) {
        return null;
    }

    return (
        <div
            id={tabBarId ?? undefined}
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
                            onClick={onChange!}
                        >
                            {heading}
                        </Tab>
                    );
                })}
            </div>
        </div>
    );
}

export default TabBar;
