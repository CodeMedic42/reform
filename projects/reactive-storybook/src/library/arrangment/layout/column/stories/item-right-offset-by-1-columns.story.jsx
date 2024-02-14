import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Item Right Offset By 1 Columns">
                <Row gutter="16">
                    <Column
                        width="1"
                        rightOffset={[null, null, null, null, '1']}
                    >
                        <Content>2xl: 1</Content>
                    </Column>
                    <Column width="1" rightOffset={[null, null, null, '1']}>
                        <Content>xl: 1</Content>
                    </Column>
                    <Column width="1" rightOffset={[null, null, '1']}>
                        <Content>lg: 1</Content>
                    </Column>
                    <Column width="1" rightOffset={[null, '1']}>
                        <Content>md: 1</Content>
                    </Column>
                    <Column width="1" rightOffset="1">
                        <Content>1</Content>
                    </Column>
                    <Column width="1">
                        <Content>1</Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
