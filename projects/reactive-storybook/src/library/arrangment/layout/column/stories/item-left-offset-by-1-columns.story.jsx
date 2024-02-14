import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Item Left Offset By 1 Columns">
                <Row gutter="16">
                    <Column
                        width="1"
                        leftOffset={[null, null, null, null, '1']}
                    >
                        <Content>2xl: 1</Content>
                    </Column>
                    <Column width="1" leftOffset={[null, null, null, '1']}>
                        <Content>xl: 1</Content>
                    </Column>
                    <Column width="1" leftOffset={[null, null, '1']}>
                        <Content>lg: 1</Content>
                    </Column>
                    <Column width="1" leftOffset={[null, '1']}>
                        <Content>md: 1</Content>
                    </Column>
                    <Column width="1" leftOffset="1">
                        <Content>1</Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
