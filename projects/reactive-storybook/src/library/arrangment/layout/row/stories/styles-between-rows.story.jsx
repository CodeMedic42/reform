import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import Content from '../../common/content';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Styles between rows" disableBackground>
                <Row
                    gutter="16"
                    after={['on', null, 'off', null, 'on']}
                    className="row-with-border-bottom"
                >
                    <Column width="12">
                        <Content>12</Content>
                    </Column>
                </Row>
                <Row
                    gutter="16"
                    before={['on', null, 'off', null, 'on']}
                    className="row-with-border-top"
                >
                    <Column width="12">
                        <Content>12</Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    );
}
