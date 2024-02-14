import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

// const component = 'div';
// const component = 'span';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope>
                <Row gutter="16">
                    <Column width={[null, '8', '6', '4', '2']}>
                        <Content>
                            <div>base:null</div>
                            <div>md:8</div>
                            <div>lg:6</div>
                            <div>xl:4</div>
                            <div>2xl:2</div>
                        </Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
