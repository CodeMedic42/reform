import { expect, vi } from 'vitest';
import { render } from 'vitest-browser-react/pure';
import { loadFeature, describeFeature } from '@amiceli/vitest-cucumber/browser';
import { createHarnessControl, baseStepDefinitions, attributeStepDefinitions } from '../../../../test-utils/index.js';
import Button from '../button.js';

const feature = await loadFeature('./button.feature');

describeFeature(feature, ({ Scenario, AfterEachScenario, defineSteps }) => {
    const harness = createHarnessControl();
    let clickHandler: ReturnType<typeof vi.fn>;

    AfterEachScenario(async () => {
        await harness.cleanup();
        clickHandler = undefined as any;
    });

    defineSteps((steps) => {
        baseStepDefinitions(steps, harness);
        attributeStepDefinitions(steps, harness);
    });

    // --- Component-specific steps ---

    Scenario('Verify default classes', ({ Given }) => {
        Given('the component is rendered with defaults', async () => {
            await harness.renderHarness(Button);
        });
    });

    Scenario('Verify "className" prop', ({ Given }) => {
        Given('the "className" property is set to "custom-class"', async () => {
            await harness.renderHarness(Button, { className: 'custom-class' });
        });
    });

    Scenario('Verify "color" prop applies scheme color classes', ({ Given }) => {
        Given('the "color" property is set to "primary"', async () => {
            await harness.renderHarness(Button, { color: 'primary' });
        });
    });

    Scenario('Verify "color" prop with "danger"', ({ Given }) => {
        Given('the "color" property is set to "danger"', async () => {
            await harness.renderHarness(Button, { color: 'danger' });
        });
    });

    Scenario('Verify no color classes when color not set', ({ Given }) => {
        Given('the component is rendered with defaults', async () => {
            await harness.renderHarness(Button);
        });
    });

    Scenario('Verify "design" prop applies design class', ({ Given }) => {
        Given('the "color" property is set to "primary"', async () => {
            await harness.renderHarness(Button, { color: 'primary' });
        });
    });

    Scenario('Verify "variant" prop applies variant class', ({ Given }) => {
        Given('the "variant" property is set to "sm"', async () => {
            await harness.renderHarness(Button, { variant: 'sm' });
        });
    });

    Scenario('Verify no variant class when variant not set', ({ Given }) => {
        Given('the component is rendered with defaults', async () => {
            await harness.renderHarness(Button);
        });
    });

    Scenario('Verify default element is button', ({ Given, Then }) => {
        Given('the component is rendered with defaults', async () => {
            await harness.renderHarness(Button);
        });

        Then('the root element tag is "BUTTON"', () => {
            expect(harness.getRootElement().tagName).toBe('BUTTON');
        });
    });

    Scenario('Verify Component prop changes rendered element', ({ Given, Then }) => {
        Given('the component is rendered with Component "a"', async () => {
            await harness.renderHarness(Button, { Component: 'a' });
        });

        Then('the root element tag is "A"', () => {
            expect(harness.getRootElement().tagName).toBe('A');
        });
    });

    Scenario('Verify "disabled" prop', ({ Given }) => {
        Given('the "disabled" property is set to true', async () => {
            await harness.renderHarness(Button, { disabled: true });
        });
    });

    Scenario('Verify children are rendered', ({ Given, Then }) => {
        Given('the component is rendered with text "Click Me"', async () => {
            await render(<Button>Click Me</Button>);
        });

        Then('the root element contains text "Click Me"', () => {
            const el = document.querySelector('.ra-button');
            expect(el).toBeTruthy();
            expect(el!.textContent).toContain('Click Me');
        });
    });

    Scenario('Verify click handler is called', ({ Given, Then }) => {
        Given('the component is rendered with an onClick handler', async () => {
            clickHandler = vi.fn();
            await harness.renderHarness(Button, { onClick: clickHandler });
        });

        // When "the root element clicked 1 time(s)" is handled by shared steps

        Then('the click handler was called', () => {
            expect(clickHandler).toHaveBeenCalledTimes(1);
        });
    });
});
