import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { get, isNil, map } from 'lodash-es';
import TabBar from '../tab-bar/index.js';
import { SchemeColor } from '../../../common/color-list.js';

interface TabGroupTab {
    id: string;
    heading?: React.ReactNode;
    body?: React.ReactNode;
    disabled?: boolean;
    alwaysRenderBody?: boolean;
}

interface TabGroupProps {
    defaultTabId?: string | null;
    // size?: 'lg' | 'sm';
    // justify?: boolean;
    // color?: SchemeColor;
    // background?: boolean;
    // border?: boolean;
    tabs: TabGroupTab[];
    onMove?: ((tabId: string, payload: { data: unknown }) => boolean | void) | null;
    eventData?: unknown;
}

interface TabGroupState {
    selectedTabId: string | null;
}

class TabGroup extends PureComponent<TabGroupProps, TabGroupState> {
    constructor(props: TabGroupProps) {
        super(props);

        this.handleSelect = this.handleSelect.bind(this);

        this.state = {
            selectedTabId: null,
        };
    }

    handleSelect(tabId: string): void {
        const { onMove, eventData } = this.props;

        if (!isNil(onMove)) {
            const ret = onMove(tabId, {
                data: eventData,
            });

            if (ret === false) {
                return;
            }
        }

        this.setState({
            selectedTabId: tabId,
        });
    }

    render(): React.ReactElement {
        const {
            defaultTabId = null,
            // size = 'lg',
            // justify = false,
            // color = 'primary',
            // background = false,
            // border = false,
            tabs,
        } = this.props;

        let { selectedTabId } = this.state;

        if (isNil(selectedTabId)) {
            if (!isNil(defaultTabId)) {
                selectedTabId = defaultTabId;
            } else {
                selectedTabId = get(tabs, ['0', 'id']);
            }
        }

        return (
            <>
                <TabBar
                    value={selectedTabId}
                    onChange={this.handleSelect}
                    tabs={tabs}
                />
                {map(tabs, (tab) => {
                    const hidden = selectedTabId !== tab.id;

                    return (
                        <div
                            key={tab.id}
                            className={classnames('ra-tab-panel', {
                                hidden,
                            })}
                        >
                            {!hidden || tab.alwaysRenderBody ? tab.body : null}
                        </div>
                    );
                })}
            </>
        );
    }
}

export default TabGroup;
