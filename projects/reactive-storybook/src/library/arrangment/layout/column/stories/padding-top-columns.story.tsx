import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Padding Top Columns">
                <Row gutter="16">
                    <Column
                        paddingTop={[null, 'static:10', 'static:20', 'static:30', 'static:40']}
                    >
                        <Content>
                            <div>base:null</div>
                            <div>md:10</div>
                            <div>lg:20</div>
                            <div>xl:30</div>
                            <div>2xl:40</div>
                        </Content>
                    </Column>
                    <Column width="12">
                        <Content>12</Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
