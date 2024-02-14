import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Content Columns Embedded Rows">
                <Row gutter="16">
                    <Column width="content">
                        <Content style={{ width: 100 }}>100</Content>
                    </Column>
                    <Column width="content">
                        <Row gutter="16">
                            <Column width="content">
                                <Content style={{ width: 100 }}>100</Content>
                            </Column>
                            <Column width="content">
                                <Content style={{ width: 100 }}>100</Content>
                            </Column>
                        </Row>
                        <Row gutter="16">
                            <Column width="content">
                                <Content style={{ width: 100 }}>100</Content>
                            </Column>
                            <Column width="content">
                                <Content style={{ width: 100 }}>100</Content>
                            </Column>
                            <Column width="content">
                                <Content style={{ width: 100 }}>100</Content>
                            </Column>
                        </Row>
                    </Column>
                    <Column width="content">
                        <Content style={{ width: 100 }}>100</Content>
                    </Column>
                    <Column width="content">
                        <Row gutter="16">
                            <Column width="content">
                                <Content style={{ width: 100 }}>100</Content>
                            </Column>
                            <Column width="content">
                                <Content style={{ width: 100 }}>100</Content>
                            </Column>
                            <Column width="content">
                                <Content style={{ width: 100 }}>100</Content>
                            </Column>
                        </Row>
                        <Row gutter="16">
                            <Column width="content">
                                <Content style={{ width: 100 }}>100</Content>
                            </Column>
                            <Column width="content">
                                <Content style={{ width: 100 }}>100</Content>
                            </Column>
                        </Row>
                    </Column>
                    <Column width="content">
                        <Content style={{ width: 100 }}>100</Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
