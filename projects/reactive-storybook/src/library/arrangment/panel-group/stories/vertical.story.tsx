import React from 'react';
import PanelGroup, { Panel } from '@reformjs/reactive/arrangement/panel-group';
import Page, { PageContainer } from '@reformjs/reactive/arrangement/page';
import Card from '@reformjs/reactive/arrangement/card';

export default function VerticalStory() {
    return (
        <Page>
            <PageContainer>
                <Card>
                    <div style={{ height: 500 }}>
                        <PanelGroup direction="vertical">
                            <Panel>
                                <div>
                                    <span>
                                        Panel 1
                                    </span>
                                </div>
                            </Panel>
                            <Panel>
                                <div>
                                    <span>
                                        Panel 2
                                    </span>
                                </div>
                            </Panel>
                            <Panel>
                                <div>
                                    <span>
                                        Panel 3
                                    </span>
                                </div>
                            </Panel>
                        </PanelGroup>
                    </div>
                </Card>
            </PageContainer>
        </Page>
    );
}
