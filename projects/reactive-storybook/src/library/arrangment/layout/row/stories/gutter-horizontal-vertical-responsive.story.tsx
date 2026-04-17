import React from 'react';
import ResolutionHeader from '../../common/resolution-header';
import LayoutScope from '../../common/layout-scope';
import renderForGutter from '../render-for-gutter';

export default function example() {
    return (
        <>
            <ResolutionHeader sticky />
            <LayoutScope
                title="Gutter Horizontal Vertical Responsive"
                disableBackground
            >
                {renderForGutter({
                    h: [null, '8', '32'],
                    v: [null, null, '8', '24', '32'],
                })}
            </LayoutScope>
        </>
    );
}
