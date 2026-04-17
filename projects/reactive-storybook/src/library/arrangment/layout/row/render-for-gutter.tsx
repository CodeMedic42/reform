import React from 'react';
import { Container, Row, Column } from '@reformjs/reactive/arrangement/layout';
import Content from '../common/content';

type GutterValue = string | (string | null)[] | { h?: string | (string | null)[]; v?: string | (string | null)[] } | null;

export default function renderForGutter(gutter: GutterValue, hideOverflow?: string) {
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
