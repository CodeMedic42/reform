import React from 'react';
import TabGroup, { Tab } from '@reformjs/reactive/arrangement/tab-group';
import Page, { PageContent } from '@reformjs/reactive/arrangement/page';

interface PreviewProps {
    exampleTabHeading: string;
    exampleTabDisabled: boolean;
    withPanels: boolean;
    [key: string]: unknown;
}

function preview(props: PreviewProps) {
    const {
        exampleTabHeading,
        exampleTabDisabled,
        withPanels,
        ...rest
    } = props;

    return (
        <Page>
            <PageContent>
                <TabGroup
                    {...rest}
                >
                    <Tab
                        id="tabA"
                        heading={exampleTabHeading}
                        disabled={exampleTabDisabled}
                    >
                        {withPanels ? (
                            <div>Tab A body content.</div>
                        ) : undefined}
                    </Tab>
                    <Tab id="tabB" heading="Example Tab B" />
                    <Tab id="tabC" heading="Example Tab C" disabled>
                        {withPanels ? (
                            <div>Tab C body content (disabled tab).</div>
                        ) : undefined}
                    </Tab>
                </TabGroup>
            </PageContent>
        </Page>
    );
}

preview.storyName = 'Preview';
preview.parameters = {
    options: {
        showPanel: true,
    },
};
preview.args = {
    exampleTabHeading: 'Example Tab A',
    exampleTabDisabled: false,
    disabled: false,
    withPanels: true,
};
preview.argTypes = {
    id: {
        control: 'text',
        table: {
            defaultValue: { summary: 'null' },
        },
    },
    className: {
        control: 'text',
        table: {
            defaultValue: { summary: 'null' },
        },
    },
    exampleTabHeading: {
        control: 'text',
        table: {
            defaultValue: { summary: 'null' },
        },
    },
    exampleTabDisabled: {
        control: 'boolean',
        table: {
            defaultValue: { summary: false },
        },
    },
    disabled: {
        control: 'boolean',
        table: {
            defaultValue: { summary: false },
        },
    },
    withPanels: {
        control: 'boolean',
        table: {
            defaultValue: { summary: true },
        },
    },
    onChange: { table: { disable: true } },
};

export default preview;
