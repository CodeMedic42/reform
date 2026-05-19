import { expect } from 'vitest';
import { render } from 'vitest-browser-react/pure';
import { loadFeature, describeFeature } from '@amiceli/vitest-cucumber/browser';
import { createHarnessControl, baseStepDefinitions, attributeStepDefinitions } from '../../../../test-utils/index.js';
import Chip from '../chip.js';

const feature = await loadFeature('./chip.feature');

describeFeature(feature, ({ Scenario, AfterEachScenario, defineSteps }) => {
    const harness = createHarnessControl();

    AfterEachScenario(async () => {
        await harness.cleanup();
    });

    defineSteps((steps) => {
        baseStepDefinitions(steps, harness);
        attributeStepDefinitions(steps, harness);
    });

    // --- Component-specific steps ---

    Scenario('Verify default className', ({ Given }) => {
        Given('the component is rendered with defaults', async () => {
            await harness.renderHarness(Chip);
        });
    });

    Scenario('Verify "id" prop', ({ Given }) => {
        Given('the "id" property is set to "foo"', async () => {
            await harness.renderHarness(Chip, { id: 'foo' });
        });
    });

    Scenario('Verify "id" prop when null', ({ Given }) => {
        Given('the "id" property is set to null', async () => {
            await harness.renderHarness(Chip, { id: null });
        });
        // Then handled by shared attributeStepDefinitions
    });

    Scenario('Verify "className" prop', ({ Given }) => {
        Given('the "className" property is set to "custom-class"', async () => {
            await harness.renderHarness(Chip, { className: 'custom-class' });
        });
    });

    Scenario('Verify "className" prop when null', ({ Given }) => {
        Given('the "className" property is set to null', async () => {
            await harness.renderHarness(Chip, { className: null });
        });
    });

    Scenario('Verify default size', ({ Given }) => {
        Given('the component is rendered with defaults', async () => {
            await harness.renderHarness(Chip);
        });
    });

    Scenario('Verify "size" prop set to "xs"', ({ Given }) => {
        Given('the "size" property is set to "xs"', async () => {
            await harness.renderHarness(Chip, { size: 'xs' });
        });
    });

    Scenario('Verify "size" prop set to "sm"', ({ Given }) => {
        Given('the "size" property is set to "sm"', async () => {
            await harness.renderHarness(Chip, { size: 'sm' });
        });
    });

    Scenario('Verify "size" prop set to "lg"', ({ Given }) => {
        Given('the "size" property is set to "lg"', async () => {
            await harness.renderHarness(Chip, { size: 'lg' });
        });
    });

    Scenario('Verify "size" prop set to "xl"', ({ Given }) => {
        Given('the "size" property is set to "xl"', async () => {
            await harness.renderHarness(Chip, { size: 'xl' });
        });
    });

    Scenario('Verify "size" prop when null defaults to md', ({ Given }) => {
        Given('the "size" property is set to null', async () => {
            await harness.renderHarness(Chip, { size: null });
        });
    });

    Scenario('Verify default variant', ({ Given }) => {
        Given('the component is rendered with defaults', async () => {
            await harness.renderHarness(Chip);
        });
    });

    Scenario('Verify "variant" prop set to "pill"', ({ Given }) => {
        Given('the "variant" property is set to "pill"', async () => {
            await harness.renderHarness(Chip, { variant: 'pill' });
        });
    });

    Scenario('Verify "variant" prop when null defaults to rectangle', ({ Given }) => {
        Given('the "variant" property is set to null', async () => {
            await harness.renderHarness(Chip, { variant: null });
        });
    });

    Scenario('Verify "color" prop applies palette color class', ({ Given }) => {
        Given('the "color" property is set to "blue"', async () => {
            await harness.renderHarness(Chip, { color: 'blue' });
        });
    });

    Scenario('Verify default shade when color is set', ({ Given }) => {
        Given('the "color" property is set to "blue"', async () => {
            await harness.renderHarness(Chip, { color: 'blue' });
        });
    });

    Scenario('Verify "shade" prop', ({ Given }) => {
        Given('the "color" property is set to "blue"', async () => {
            await harness.renderHarness(Chip, { color: 'blue' });
        });
    });

    Scenario('Verify "bordered" prop adds border class', ({ Given }) => {
        Given('the "color" property is set to "blue"', async () => {
            await harness.renderHarness(Chip, { color: 'blue' });
        });
    });

    Scenario('Verify "bordered" prop when false', ({ Given }) => {
        Given('the "color" property is set to "blue"', async () => {
            await harness.renderHarness(Chip, { color: 'blue' });
        });
    });

    Scenario('Verify "floating" prop adds shadow class', ({ Given }) => {
        Given('the "floating" property is set to true', async () => {
            await harness.renderHarness(Chip, { floating: true });
        });
    });

    Scenario('Verify "floating" prop when false', ({ Given }) => {
        Given('the "floating" property is set to false', async () => {
            await harness.renderHarness(Chip, { floating: false });
        });
    });

    Scenario('Verify "disabled" prop adds disabled class', ({ Given }) => {
        Given('the "disabled" property is set to true', async () => {
            await harness.renderHarness(Chip, { disabled: true });
        });
    });

    Scenario('Verify "disabled" prop when false', ({ Given }) => {
        Given('the component is rendered with defaults', async () => {
            await harness.renderHarness(Chip);
        });
    });

    Scenario('Verify renders as span by default', ({ Given, Then }) => {
        Given('the component is rendered with defaults', async () => {
            await harness.renderHarness(Chip);
        });

        Then('the root element tag is "SPAN"', () => {
            const el = harness.getRootElement();
            expect(el.tagName).toBe('SPAN');
        });
    });

    Scenario('Verify renders as button when onClick is set', ({ Given, Then }) => {
        Given('the component is rendered with an onClick handler', async () => {
            await harness.renderHarness(Chip, { onClick: () => {} });
        });

        Then('the root element tag is "BUTTON"', () => {
            const el = harness.getRootElement();
            expect(el.tagName).toBe('BUTTON');
        });
    });

    Scenario('Verify renders as button when asButton is true', ({ Given, Then }) => {
        Given('the "asButton" property is set to true', async () => {
            await harness.renderHarness(Chip, { asButton: true });
        });

        Then('the root element tag is "BUTTON"', () => {
            const el = harness.getRootElement();
            expect(el.tagName).toBe('BUTTON');
        });
    });

    Scenario('Verify children are rendered', ({ Given, Then }) => {
        Given('the component is rendered with text "Chip Label"', async () => {
            await render(<Chip>Chip Label</Chip>);
        });

        Then('the root element contains text "Chip Label"', () => {
            const el = document.querySelector('.ra-chip');
            expect(el).toBeTruthy();
            expect(el!.textContent).toContain('Chip Label');
        });
    });
});
