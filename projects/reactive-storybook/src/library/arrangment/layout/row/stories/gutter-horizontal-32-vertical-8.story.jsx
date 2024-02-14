import React from 'react';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import renderForGutter from '../render-for-gutter';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope
                title="Gutter Horizontal 32 Vertical 8"
                disableBackground
            >
                {renderForGutter({ h: '32', v: '8' })}
            </LayoutScope>
        </>
    );
}
