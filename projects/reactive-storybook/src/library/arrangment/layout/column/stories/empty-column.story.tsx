import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Empty Column">
                <Row gutter="16">
                    <Column />
                </Row>
                <Row gutter="16">
                    <Column>
                        <Content>100%</Content>
                    </Column>
                    <Column />
                    <Column>
                        <Content>100%</Content>
                    </Column>
                </Row>
                <Row gutter="16">
                    <Column>
                        <Content>100%</Content>
                    </Column>
                    <Column />
                    <Column>
                        <Row gutter="16">
                            <Column />
                            <Column>
                                <Content>100%</Content>
                            </Column>
                            <Column />
                            <Column>
                                <Content>100%</Content>
                            </Column>
                        </Row>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
