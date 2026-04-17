import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Alignment">
                <Row gutter="16">
                    <Column width="6">
                        <Row gutter="16">
                            <Column width="fill">
                                <Content>Example 1</Content>
                            </Column>
                        </Row>
                        <Row gutter="16">
                            <Column width="fill">
                                <Content>Example 1</Content>
                            </Column>
                        </Row>
                    </Column>
                    <Column width="6">
                        <Content>null</Content>
                    </Column>
                </Row>
                <Row gutter="16">
                    <Column width="6">
                        <Row gutter="16">
                            <Column width="fill">
                                <Content>Example 2</Content>
                            </Column>
                        </Row>
                        <Row gutter="16">
                            <Column width="fill">
                                <Content>Example 2</Content>
                            </Column>
                        </Row>
                    </Column>
                    <Column width="6" align="top">
                        <Content>top</Content>
                    </Column>
                </Row>
                <Row gutter="16">
                    <Column width="6">
                        <Row gutter="16">
                            <Column width="fill">
                                <Content>Example 3</Content>
                            </Column>
                        </Row>
                        <Row gutter="16">
                            <Column width="fill">
                                <Content>Example 3</Content>
                            </Column>
                        </Row>
                    </Column>
                    <Column width="6" align="center">
                        <Content>center</Content>
                    </Column>
                </Row>
                <Row gutter="16">
                    <Column width="6">
                        <Row gutter="16">
                            <Column width="fill">
                                <Content>Example 4</Content>
                            </Column>
                        </Row>
                        <Row gutter="16">
                            <Column width="fill">
                                <Content>Example 4</Content>
                            </Column>
                        </Row>
                    </Column>
                    <Column width="6" align="bottom">
                        <Content>bottom</Content>
                    </Column>
                </Row>
                <Row gutter="16">
                    <Column width="6">
                        <Row gutter="16">
                            <Column width="fill">
                                <Content>Example 5</Content>
                            </Column>
                        </Row>
                        <Row gutter="16">
                            <Column width="fill">
                                <Content>Example 5</Content>
                            </Column>
                        </Row>
                        <Row gutter="16">
                            <Column width="fill">
                                <Content>Example 5</Content>
                            </Column>
                        </Row>
                    </Column>
                    <Column width="6" align={['bottom', 'center', null, 'top']}>
                        <Content>
                            <div>base: bottom</div>
                            <div>md: center</div>
                            <div>lg: null</div>
                            <div>xl: top</div>
                        </Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
