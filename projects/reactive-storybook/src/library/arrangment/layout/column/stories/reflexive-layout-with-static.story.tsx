import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Reflexive layout with static" disableBackground>
                <Row gutter="16">
                    <Column width="static:150">
                        <Content>static:150</Content>
                    </Column>
                    <Column width={[null, 'static:200']}>
                        <Content>2:static:200</Content>
                    </Column>
                    <Column width={[null, null, 'static:250']}>
                        <Content>3:static:250</Content>
                    </Column>
                    <Column width={[null, null, null, 'static:300']}>
                        <Content>4:static:300</Content>
                    </Column>
                    <Column width={[null, null, null, null, 'static:350']}>
                        <Content>5:static:350</Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
