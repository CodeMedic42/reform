import React from 'react';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import renderForGutter from '../render-for-gutter';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Hide Overflow" disableBackground>
                {renderForGutter(null, '16')}
            </LayoutScope>
        </>
    );
}
