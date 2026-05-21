import React from 'react';
import Page, { PageContainer } from '@reformjs/reactive/arrangement/page';
import StickyContainer from '@reformjs/reactive/arrangement/sticky-container';

export default function DefaultStory() {
    return (
        <Page>
            <StickyContainer
                style={{
                    '--sticky-gutter-width': '20px',
                }}
            >
                <div style={{ whiteSpace: 'nowrap' }}>
                    <span style={{
                        padding: '0 8px',
                        position: 'sticky',
                        left: 'var(--sticky-left-offset)',
                        background: 'violet',
                    }}><span>Page Contents</span></span>
                    <span style={{ padding: '0 8px', background:'blue' }}><span>Content that is long enough to test overflow behavior</span></span>
                    <span style={{ padding: '0 8px', background:'red' }}><span>Content that is long enough to test overflow behavior</span></span>
                    <span style={{ padding: '0 8px', background:'green' }}><span>Content that is long enough to test overflow behavior</span></span>
                </div>
                <StickyContainer
                    style={{
                        '--sticky-gutter-width': '50px',
                    }}
                >
                    <div style={{ whiteSpace: 'nowrap' }}>
                        <span style={{
                            padding: '0 8px',
                            position: 'sticky',
                            left: 'var(--sticky-left-offset)',
                            background: 'violet',
                        }}><span>Page Contents</span></span>
                        <span style={{ padding: '0 8px', background:'blue' }}><span>Content that is long enough to test overflow behavior</span></span>
                        <span style={{ padding: '0 8px', background:'red' }}><span>Content that is long enough to test overflow behavior</span></span>
                        <span style={{ padding: '0 8px', background:'green' }}><span>Content that is long enough to test overflow behavior</span></span>
                    </div>
                </StickyContainer>
            </StickyContainer>
        </Page>
    );
}
