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
                            <div>1:null</div>
                            <div>2:10</div>
                            <div>3:20</div>
                            <div>4:30</div>
                            <div>5:40</div>
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
