import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Numbered Columns Embedded Rows">
                <Row gutter="16">
                    <Column width="1">
                        <Content>1</Content>
                    </Column>
                    <Column width="3">
                        <Row gutter="16">
                            <Column width="4">
                                <Content>3:4</Content>
                            </Column>
                            <Column width="4">
                                <Content>3:4</Content>
                            </Column>
                        </Row>
                        <Row gutter="16">
                            <Column width="4">
                                <Content>3:4</Content>
                            </Column>
                            <Column width="4">
                                <Content>3:4</Content>
                            </Column>
                            <Column width="4">
                                <Content>3:4</Content>
                            </Column>
                        </Row>
                    </Column>
                    <Column width="1">
                        <Content>1</Content>
                    </Column>
                    <Column width="3">
                        <Row gutter="16">
                            <Column width="4">
                                <Content>3:4</Content>
                            </Column>
                            <Column width="4">
                                <Content>3:4</Content>
                            </Column>
                            <Column width="4">
                                <Content>3:4</Content>
                            </Column>
                        </Row>
                        <Row gutter="16">
                            <Column width="4">
                                <Content>3:4</Content>
                            </Column>
                            <Column width="4">
                                <Content>3:4</Content>
                            </Column>
                        </Row>
                    </Column>
                    <Column width="1">
                        <Content>1</Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
