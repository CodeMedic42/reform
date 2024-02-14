import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Nested Rows(Gutter 16-8)" disableBackground>
                <Row gutter="16">
                    <Column width="3">
                        <Row gutter="8">
                            <Column width="7">
                                <Content>3-7</Content>
                            </Column>
                            <Column width="5">
                                <Content>3-5</Content>
                            </Column>
                        </Row>
                        <Row gutter={[null, null, '8']}>
                            <Column width="2">
                                <Content>3-2</Content>
                            </Column>
                            <Column width="2">
                                <Content>3-2</Content>
                            </Column>
                            <Column width="2">
                                <Content>3-2</Content>
                            </Column>
                            <Column width="2">
                                <Content>3-2</Content>
                            </Column>
                            <Column width="2">
                                <Content>3-2</Content>
                            </Column>
                            <Column width="2">
                                <Content>3-2</Content>
                            </Column>
                        </Row>
                    </Column>
                    <Column width="3">
                        <Row gutter="8">
                            <Column width="4">
                                <Content>3-4</Content>
                            </Column>
                            <Column width="4">
                                <Content>3-4</Content>
                            </Column>
                            <Column width="4">
                                <Content>3-4</Content>
                            </Column>
                        </Row>
                    </Column>
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                </Row>
                <Row gutter="16">
                    <Column width="6">
                        <Row gutter="8">
                            <Column width="4">
                                <Content>6-4</Content>
                            </Column>
                            <Column width="4">
                                <Content>6-4</Content>
                            </Column>
                            <Column width="4">
                                <Content>6-4</Content>
                            </Column>
                        </Row>
                    </Column>
                    <Column width="6">
                        <Content>6</Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
