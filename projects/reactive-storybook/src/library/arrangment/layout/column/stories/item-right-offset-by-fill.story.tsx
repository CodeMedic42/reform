import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Item Right Offset By fill">
                <Row gutter="16">
                    <Column
                        width="1"
                        rightOffset={[null, null, null, null, 'fill']}
                    >
                        <Content>5: fill</Content>
                    </Column>
                    <Column width="1" rightOffset={[null, null, null, 'fill']}>
                        <Content>4: fill</Content>
                    </Column>
                    <Column width="1" rightOffset={[null, null, 'fill']}>
                        <Content>3: fill</Content>
                    </Column>
                    <Column width="1" rightOffset={[null, 'fill']}>
                        <Content>2: fill</Content>
                    </Column>
                    <Column width="1" rightOffset="fill">
                        <Content>fill</Content>
                    </Column>
                    <Column width="1">
                        <Content>1</Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
