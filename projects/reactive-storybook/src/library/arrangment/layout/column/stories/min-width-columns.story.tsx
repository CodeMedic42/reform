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
                            <div>1:null</div>
                            <div>2:250</div>
                            <div>3:340</div>
                            <div>4:400</div>
                            <div>5:650</div>
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
