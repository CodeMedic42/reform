import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Ordered Columns">
                <Row gutter="16">
                    <Column width="1" order={['1', '2', '3']}>
                        <Content>1</Content>
                    </Column>
                    <Column width="1" order={['2', '3', '1']}>
                        <Content>2</Content>
                    </Column>
                    <Column width="1" order={['3', '1', '2']}>
                        <Content>3</Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
