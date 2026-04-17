import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Alignment" disableBackground>
                <Row gutter="16">
                    <Column width="3">
                        <Content style={{ height: 100 }}>filler</Content>
                    </Column>
                    <Column width="9">
                        <Content>Default</Content>
                    </Column>
                </Row>
                <Row gutter="16" align="top">
                    <Column width="3">
                        <Content style={{ height: 100 }}>filler</Content>
                    </Column>
                    <Column width="9">
                        <Content>top</Content>
                    </Column>
                </Row>
                <Row gutter="16" align="center">
                    <Column width="3">
                        <Content style={{ height: 100 }}>filler</Content>
                    </Column>
                    <Column width="9">
                        <Content>center</Content>
                    </Column>
                </Row>
                <Row gutter="16" align="bottom">
                    <Column width="3">
                        <Content style={{ height: 100 }}>filler</Content>
                    </Column>
                    <Column width="9">
                        <Content>bottom</Content>
                    </Column>
                </Row>
                <Row gutter="16" align={['bottom', 'center', null, 'top']}>
                    <Column width="3">
                        <Content style={{ height: 100 }}>filler</Content>
                    </Column>
                    <Column width="9">
                        <Content>bottom, center, null, top</Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
