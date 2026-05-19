import React from 'react';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import renderForGutter from '../render-for-gutter';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope title="Gutter Vertical 8" disableBackground>
                {renderForGutter({ v: '8' })}
            </LayoutScope>
        </>
    );
}
