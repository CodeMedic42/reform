import React from 'react';
import Accordion, { AccordionFrame, AccordionFrameTextHeader } from '@reformjs/reactive/arrangement/accordion';
import Page, { PageSurface } from '@reformjs/reactive/arrangement/page';

export default function VerticalAdjustableStory() {
    return (
        <Page
            style={{
                '--page-left-panel-width': '200px',
            }}
        >
            <PageSurface position='left'>
                <Accordion orientation="vertical" mode="adjustable" defaultExpanded={[0, 1, 2, 3]}>
                    <AccordionFrame heading={<AccordionFrameTextHeader text="Frame 1" />}>
                        Body 1
                    </AccordionFrame>
                    <AccordionFrame heading={<AccordionFrameTextHeader text="Frame 2" />}>
                        Body 2
                    </AccordionFrame>
                    <AccordionFrame heading={<AccordionFrameTextHeader text="Frame 3" />}>
                        Body 3
                    </AccordionFrame>
                    <AccordionFrame heading={<AccordionFrameTextHeader text="Frame 4" />}>
                        Body 4
                    </AccordionFrame>
                </Accordion>
            </PageSurface>
        </Page>
    );
}
