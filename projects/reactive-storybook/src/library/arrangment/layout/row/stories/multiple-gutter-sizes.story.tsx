import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Multiple Gutter sizes" disableBackground>
                <Row>
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                </Row>
                <Row gutter="8">
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                </Row>
                <Row gutter="16">
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                </Row>
                <Row gutter="24">
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                </Row>
                <Row gutter="32">
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
