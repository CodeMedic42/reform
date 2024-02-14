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
                        <Content>md:fill</Content>
                    </Column>
                    <Column width={[null, null, 'fill']}>
                        <Content>lg:fill</Content>
                    </Column>
                    <Column width={[null, null, null, 'fill']}>
                        <Content>xl:fill</Content>
                    </Column>
                    <Column width={[null, null, null, null, 'fill']}>
                        <Content>2xl:fill</Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
