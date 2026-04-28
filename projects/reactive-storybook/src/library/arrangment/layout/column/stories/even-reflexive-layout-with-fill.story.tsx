import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Even Reflexive layout with fill">
                <Row gutter="16">
                    <Column width="fill">
                        <Content>fill</Content>
                    </Column>
                    <Column width="fill">
                        <Content>fill</Content>
                    </Column>
                    <Column width={[null, 'fill']}>
                        <Content>2:fill</Content>
                    </Column>
                    <Column width={[null, null, 'fill']}>
                        <Content>3:fill</Content>
                    </Column>
                    <Column width={[null, null, null, 'fill']}>
                        <Content>4:fill</Content>
                    </Column>
                    <Column width={[null, null, null, null, 'fill']}>
                        <Content>5:fill</Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
