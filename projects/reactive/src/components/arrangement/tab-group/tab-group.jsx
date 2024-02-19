import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import map from 'lodash/map';
import TabBar from '../tab-bar';
import { schemeColorPropType } from '../../../common/color-list';

class TabGroup extends PureComponent {
    static propTypes = {
        defaultTabId: PropTypes.string,
        size: PropTypes.oneOf(['lg', 'sm']),
        justify: PropTypes.bool,
        color: schemeColorPropType,
        background: PropTypes.bool,
        border: PropTypes.bool,
        tabs: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string,
                heading: PropTypes.node,
                body: PropTypes.node,
                disabled: PropTypes.bool,
                alwaysRenderBody: PropTypes.bool,
            }),
        ).isRequired,
        onMove: PropTypes.func,
        // eslint-disable-next-line react/forbid-prop-types
        onMoveMeta: PropTypes.any,
    };

    static defaultProps = {
        defaultTabId: null,
        size: 'lg',
        justify: false,
        background: false,
        border: false,
        color: 'primary',
        onMove: null,
        onMoveMeta: null,
    };

    constructor(props) {
        super(props);

        this.handleSelect = this.handleSelect.bind(this);

        this.state = {
            selectedTabId: null,
        };
    }

    handleSelect(tabId) {
        const { onMove, onMoveMeta } = this.props;

        if (!isNil(onMove)) {
            const ret = onMove(tabId, {
                meta: onMoveMeta,
            });

            if (ret === false) {
                return;
            }
        }

        this.setState({
            selectedTabId: tabId,
        });
    }

    render() {
        const {
            defaultTabId, size, justify, color, background, border, tabs,
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
                    size={size}
                    justify={justify}
                    color={color}
                    background={background}
                    border={border}
                    onSelect={this.handleSelect}
                    tabs={tabs}
                    selectedTab={selectedTabId}
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
