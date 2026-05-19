import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Reflexive layout with content">
                <Row gutter="16">
                    <Column width="content">
                        <Content>content</Content>
                    </Column>
                    <Column width={[null, 'content']}>
                        <Content>2:content</Content>
                    </Column>
                    <Column width={[null, null, 'content']}>
                        <Content>3:content</Content>
                    </Column>
                    <Column width={[null, null, null, 'content']}>
                        <Content>4:content</Content>
                    </Column>
                    <Column width={[null, null, null, null, 'content']}>
                        <Content>5:content</Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
