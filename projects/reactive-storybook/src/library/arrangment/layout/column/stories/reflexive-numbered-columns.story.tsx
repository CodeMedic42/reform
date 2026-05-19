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
                            <div>1:null</div>
                            <div>2:8</div>
                            <div>3:6</div>
                            <div>4:4</div>
                            <div>5:2</div>
                        </Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
