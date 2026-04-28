import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Item Left Offset By fill">
                <Row gutter="16">
                    <Column
                        width="1"
                        leftOffset={[null, null, null, null, 'fill']}
                    >
                        <Content>5:fill</Content>
                    </Column>
                    <Column width="1" leftOffset={[null, null, null, 'fill']}>
                        <Content>4: fill</Content>
                    </Column>
                    <Column width="1" leftOffset={[null, null, 'fill']}>
                        <Content>3: fill</Content>
                    </Column>
                    <Column width="1" leftOffset={[null, 'fill']}>
                        <Content>2: fill</Content>
                    </Column>
                    <Column width="1" leftOffset="fill">
                        <Content>fill</Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
