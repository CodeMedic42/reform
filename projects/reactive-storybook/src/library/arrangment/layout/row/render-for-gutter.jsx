import React from 'react';
import { Container, Row, Column } from '@reformjs/reactive/arrangement/layout';
import Content from '../common/content';

export default function renderForGutter(gutter, hideOverflow) {
    return (
        <Container gutter={gutter} hideOverflow={hideOverflow}>
            <Row gutter="16">
                <Column width="1">
                    <Content>1</Content>
                </Column>
                <Column width="1">
                    <Content>1</Content>
                </Column>
                <Column width="1">
                    <Content>1</Content>
                </Column>
                <Column width="1">
                    <Content>1</Content>
                </Column>
                <Column width="1">
                    <Content>1</Content>
                </Column>
                <Column width="1">
                    <Content>1</Content>
                </Column>
                <Column width="1">
                    <Content>1</Content>
                </Column>
                <Column width="1">
                    <Content>1</Content>
                </Column>
                <Column width="1">
                    <Content>1</Content>
                </Column>
                <Column width="1">
                    <Content>1</Content>
                </Column>
                <Column width="1">
                    <Content>1</Content>
                </Column>
                <Column width="1">
                    <Content>1</Content>
                </Column>
            </Row>
        </Container>
    );
}
