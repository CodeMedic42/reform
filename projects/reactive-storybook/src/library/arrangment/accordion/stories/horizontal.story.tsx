import React from 'react';
import Accordion, { AccordionFrame, AccordionFrameTextHeader } from '@reformjs/reactive/arrangement/accordion';
import Page, { PageSurface } from '@reformjs/reactive/arrangement/page';

export default function HorizontalStory() {
    return (
        <Page
            style={{
                '--page-top-panel-height': '200px',
            }}
        >
            <PageSurface position='top'>
                <Accordion orientation="horizontal">
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
