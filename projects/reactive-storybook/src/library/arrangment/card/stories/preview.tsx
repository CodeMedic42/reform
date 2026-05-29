import React from 'react';
import Card from '@reformjs/reactive/arrangement/card';
import Page, { PageContent } from '@reformjs/reactive/arrangement/page';

export default function DefaultStory() {
    return (
        <Page>
			<PageContent>
				<Card>
					<div style={{ whiteSpace: 'nowrap' }}>
						<span style={{
							padding: '0 8px',
							position: 'sticky',
							left: 'var(--sticky-left-offset)',
							background: 'violet',
							boxSizing: 'content-box'
						}}><span>Page Contents</span></span>
						<span style={{ padding: '0 8px', background:'blue', boxSizing: 'content-box' }}><span>Content that is long enough to test overflow behavior</span></span>
						<span style={{ padding: '0 8px', background:'red', boxSizing: 'content-box' }}><span>Content that is long enough to test overflow behavior</span></span>
						<span style={{ padding: '0 8px', background:'green', boxSizing: 'content-box' }}><span>Content that is long enough to test overflow behavior</span></span>
					</div>
				</Card>
			</PageContent>
        </Page>
    );
}
