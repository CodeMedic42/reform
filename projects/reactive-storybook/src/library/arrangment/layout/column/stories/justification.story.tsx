import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Justification">
                <Row gutter="16">
                    <Column width="12">
                        <Content shrink>null</Content>
                    </Column>
                </Row>
                <Row gutter="16">
                    <Column width="12" justify="left">
                        <Content shrink>left</Content>
                    </Column>
                </Row>
                <Row gutter="16">
                    <Column width="12" justify="center">
                        <Content shrink>center</Content>
                    </Column>
                </Row>
                <Row gutter="16">
                    <Column width="12" justify="right">
                        <Content shrink>right</Content>
                    </Column>
                </Row>
                <Row gutter="16">
                    <Column
                        width="12"
                        justify={['right', 'center', null, 'left']}
                    >
                        <Content shrink>
                            <div>base: right</div>
                            <div>md: center</div>
                            <div>lg: null</div>
                            <div>xl: left</div>
                        </Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
