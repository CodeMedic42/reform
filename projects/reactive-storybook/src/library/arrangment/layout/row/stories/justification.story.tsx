import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Justification" disableBackground>
                <Row gutter="16">
                    <Column width="3">
                        <Content>default</Content>
                    </Column>
                    <Column width="3">
                        <Content>default</Content>
                    </Column>
                </Row>
                <Row gutter="16" justify="left">
                    <Column width="3">
                        <Content>left</Content>
                    </Column>
                    <Column width="3">
                        <Content>left</Content>
                    </Column>
                </Row>
                <Row gutter="16" justify="center">
                    <Column width="3">
                        <Content>center</Content>
                    </Column>
                    <Column width="3">
                        <Content>center</Content>
                    </Column>
                </Row>
                <Row gutter="16" justify="right">
                    <Column width="3">
                        <Content>right</Content>
                    </Column>
                    <Column width="3">
                        <Content>right</Content>
                    </Column>
                </Row>
                <Row gutter="16" justify={['right', 'center', null, 'left']}>
                    <Column width="3">
                        <Content>
                            <div>base: right</div>
                            <div>md: center</div>
                            <div>lg: null</div>
                            <div>xl: left</div>
                        </Content>
                    </Column>
                    <Column width="3">
                        <Content>
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
