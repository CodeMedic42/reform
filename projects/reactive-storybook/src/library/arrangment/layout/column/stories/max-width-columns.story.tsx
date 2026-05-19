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
                            <div>1:null</div>
                            <div>2:200</div>
                            <div>3:300</div>
                            <div>4:400</div>
                            <div>5:500</div>
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
