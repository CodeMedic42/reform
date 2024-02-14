import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Combo Reflexive layout">
                <Row gutter="16">
                    <Column width="content">
                        <Content>content</Content>
                    </Column>
                    <Column width="1">
                        <Content>1</Content>
                    </Column>
                    <Column width={[null, 'fill', '3', 'content', '5']}>
                        <Content>
                            <div>base: null</div>
                            <div>md: fill</div>
                            <div>lg: 3</div>
                            <div>xl: content</div>
                            <div>2xl: 5</div>
                        </Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
