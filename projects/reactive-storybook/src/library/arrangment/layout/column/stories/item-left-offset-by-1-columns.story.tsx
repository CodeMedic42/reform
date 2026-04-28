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
                        <Content>5: 1</Content>
                    </Column>
                    <Column width="1" leftOffset={[null, null, null, '1']}>
                        <Content>4: 1</Content>
                    </Column>
                    <Column width="1" leftOffset={[null, null, '1']}>
                        <Content>3: 1</Content>
                    </Column>
                    <Column width="1" leftOffset={[null, '1']}>
                        <Content>2: 1</Content>
                    </Column>
                    <Column width="1" leftOffset="1">
                        <Content>1</Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
