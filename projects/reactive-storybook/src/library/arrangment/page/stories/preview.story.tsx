import React from 'react';
import Page, { PageContent, PageSurface } from '@reformjs/reactive/arrangement/page';

const exampleStyle = {
    width: '1200px',
    backgroundColor: 'salmon',
    border: '10px solid black',
    boxSizing: 'border-box',
};

export default function DefaultStory() {
    return (
        <Page
            // disableAdjustment={true}
            style={{
                '--page-top-panel-height': '50px',
                '--page-left-panel-width': '200px',
                '--page-right-panel-width': '200px',
                '--page-bottom-panel-height': '50px',
            }}
        >
            <PageSurface
                style={{ backgroundColor: 'purple', border: '2px solid black' }}
                position="top"
            >
                <div>
                    Top Surface
                </div>
            </PageSurface>
            <PageSurface
                style={{ backgroundColor: 'red', border: '2px solid black' }}
                position="left"
            >
                <div>
                    Left Surface
                </div>                
            </PageSurface>
            <PageContent
                style={{ backgroundColor: 'orange' }}
            >
                <div style={{
                        width: '1200px',
                        backgroundColor: 'indigo',
                        border: '10px solid black',
                        boxSizing: 'border-box',
                        position: 'sticky',
                        top: 'var(--sticky-top-offset)',
                        zIndex: 1,
                    }}
                >
                    <span>Special Top</span>
                </div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={exampleStyle}><span>Content</span></div>
                <div style={{
                        width: '1200px',
                        backgroundColor: 'indigo',
                        border: '10px solid black',
                        boxSizing: 'border-box',
                        position: 'sticky',
                        bottom: 'var(--sticky-top-offset)',
                        zIndex: 1,
                    }}
                >
                    <span>Special Bottom</span>
                </div>
            </PageContent>
            <PageSurface
                style={{ backgroundColor: 'blue', border: '2px solid black' }}
                position="right"
            >
                <div>
                    Right Surface
                </div>
            </PageSurface>
            <PageSurface
                style={{ backgroundColor: 'green', border: '2px solid black' }}
                position="bottom"
            >
                <div>
                    Bottom Surface
                </div>
            </PageSurface>
        </Page>
    );
}
