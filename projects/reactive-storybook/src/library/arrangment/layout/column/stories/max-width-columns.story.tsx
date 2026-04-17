import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Max Width Columns">
                <Row gutter="16">
                    <Column
                        maxWidth={[null, 'static:200', 'static:300', 'static:400', 'static:500']}
                    >
                        <Content>
                            <div>base:null</div>
                            <div>md:200</div>
                            <div>lg:300</div>
                            <div>xl:400</div>
                            <div>2xl:500</div>
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
