import { expect } from 'vitest';
import { render } from 'vitest-browser-react/pure';
import { loadFeature, describeFeature } from '@amiceli/vitest-cucumber/browser';
import { createHarnessControl, baseStepDefinitions, attributeStepDefinitions } from '../../../../test-utils/index.js';
import Typography from '../typography.js';

const feature = await loadFeature('./typography.feature');

describeFeature(feature, ({ Scenario, AfterEachScenario, defineSteps }) => {
    const harness = createHarnessControl();

    AfterEachScenario(async () => {
        await harness.cleanup();
    });

    // Register shared step definitions
    defineSteps((steps) => {
        baseStepDefinitions(steps, harness);
        attributeStepDefinitions(steps, harness);
    });

    // --- Component-specific steps ---

    Scenario('Verify default className', ({ Given }) => {
        Given('the component is rendered with no props', async () => {
            await harness.renderHarness(Typography);
        });
    });

    Scenario('Verify custom className is applied', ({ Given }) => {
        Given('the "className" property is set to "custom-class"', async () => {
            await harness.renderHarness(Typography, { className: 'custom-class' });
        });
    });

    Scenario('Verify null className does not add "null" text', ({ Given }) => {
        Given('the "className" property is set to null', async () => {
            await harness.renderHarness(Typography, { className: null });
        });
    });

    Scenario('Verify inline prop adds inline class', ({ Given }) => {
        Given('the "inline" property is set to true', async () => {
            await harness.renderHarness(Typography, { inline: true });
        });
    });

    Scenario('Verify inline prop default does not add inline class', ({ Given }) => {
        Given('the component is rendered with no props', async () => {
            await harness.renderHarness(Typography);
        });
    });

    Scenario('Verify color prop applies palette color class', ({ Given }) => {
        Given('the "color" property is set to "blue"', async () => {
            await harness.renderHarness(Typography, { color: 'blue' });
        });
    });

    Scenario('Verify shade prop applies shade class', ({ Given }) => {
        Given('the "color" property is set to "blue"', async () => {
            await harness.renderHarness(Typography, { color: 'blue' });
        });
    });

    Scenario('Verify children are rendered', ({ Given, Then }) => {
        Given('the component is rendered with text "Hello World"', async () => {
            await render(<Typography>Hello World</Typography>);
        });

        Then('the root element has text "Hello World"', () => {
            // Use harness-independent query since we rendered with children directly
            const el = document.querySelector('.ra-typography');
            expect(el).toBeTruthy();
            expect(el!.textContent).toBe('Hello World');
        });
    });

    Scenario('Verify default element is span', ({ Given, Then }) => {
        Given('the component is rendered with no props', async () => {
            await harness.renderHarness(Typography);
        });

        Then('the root element tag is "SPAN"', () => {
            const el = harness.getRootElement();
            expect(el.tagName).toBe('SPAN');
        });
    });

    Scenario('Verify Component prop changes rendered element', ({ Given, Then }) => {
        Given('the "Component" property is set to "h1"', async () => {
            await harness.renderHarness(Typography, { Component: 'h1' });
        });

        Then('the root element tag is "H1"', () => {
            const el = harness.getRootElement();
            expect(el.tagName).toBe('H1');
        });
    });
});
