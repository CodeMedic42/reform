import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Min Width Columns">
                <Row gutter="16">
                    <Column
                        width="4"
                        minWidth={[null, 'static:250', 'static:340', 'static:400', 'static:650']}
                    >
                        <Content>
                            <div>base:null</div>
                            <div>md:250</div>
                            <div>lg:340</div>
                            <div>xl:400</div>
                            <div>2xl:650</div>
                        </Content>
                    </Column>
                    <Column width="8">
                        <Content>8</Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
