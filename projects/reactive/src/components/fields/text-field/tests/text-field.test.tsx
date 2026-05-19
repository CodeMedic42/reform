import { loadFeature, describeFeature } from '@amiceli/vitest-cucumber/browser';
import { createHarnessControl, baseStepDefinitions, attributeStepDefinitions } from '../../../../test-utils/index.js';
import TextField from '../text-field.js';

const feature = await loadFeature('./text-field.feature');

describeFeature(feature, ({ Scenario, AfterEachScenario, defineSteps }) => {
    const harness = createHarnessControl();

    AfterEachScenario(async () => {
        await harness.cleanup();
    });

    defineSteps((steps) => {
        baseStepDefinitions(steps, harness);
        attributeStepDefinitions(steps, harness);
    });

    // --- Component-specific Given steps (render the component) ---

    Scenario('Verify default classes', ({ Given }) => {
        Given('the component is rendered with defaults', async () => {
            await harness.renderHarness(TextField);
        });
    });

    Scenario('Verify "id" prop', ({ Given }) => {
        Given('the "id" property is set to "foo"', async () => {
            await harness.renderHarness(TextField, { id: 'foo' });
        });
    });

    Scenario('Verify auto-generated id when not provided', ({ Given }) => {
        Given('the component is rendered with defaults', async () => {
            await harness.renderHarness(TextField);
        });
    });

    Scenario('Verify "className" prop', ({ Given }) => {
        Given('the "className" property is set to "custom-class"', async () => {
            await harness.renderHarness(TextField, { className: 'custom-class' });
        });
    });

    Scenario('Verify "className" prop when null', ({ Given }) => {
        Given('the "className" property is set to null', async () => {
            await harness.renderHarness(TextField, { className: null });
        });
    });

    Scenario('Verify "label" prop renders label text', ({ Given }) => {
        Given('the "label" property is set to "Username"', async () => {
            await harness.renderHarness(TextField, { label: 'Username' });
        });
    });

    Scenario('Verify "variant" prop applies variant class', ({ Given }) => {
        Given('the "variant" property is set to "primary"', async () => {
            await harness.renderHarness(TextField, { variant: 'primary' });
        });
    });

    Scenario('Verify "hidden" prop adds hidden class', ({ Given }) => {
        Given('the "hidden" property is set to true', async () => {
            await harness.renderHarness(TextField, { hidden: true });
        });
    });

    Scenario('Verify hidden class not present by default', ({ Given }) => {
        Given('the component is rendered with defaults', async () => {
            await harness.renderHarness(TextField);
        });
    });

    Scenario('Verify "failure" prop adds failure class', ({ Given }) => {
        Given('the "failure" property is set to true', async () => {
            await harness.renderHarness(TextField, { failure: true });
        });
    });

    Scenario('Verify failure class not present by default', ({ Given }) => {
        Given('the component is rendered with defaults', async () => {
            await harness.renderHarness(TextField);
        });
    });

    Scenario('Verify "disabled" prop disables the input', ({ Given }) => {
        Given('the "disabled" property is set to true', async () => {
            await harness.renderHarness(TextField, { disabled: true });
        });
    });

    Scenario('Verify "value" prop sets input value', ({ Given }) => {
        Given('the "value" property is set to "hello"', async () => {
            await harness.renderHarness(TextField, { value: 'hello' });
        });
    });

    Scenario('Verify has-value class when value is set', ({ Given }) => {
        Given('the "value" property is set to "hello"', async () => {
            await harness.renderHarness(TextField, { value: 'hello' });
        });
    });

    Scenario('Verify no has-value class when value is null', ({ Given }) => {
        Given('the "value" property is set to null', async () => {
            await harness.renderHarness(TextField, { value: null });
        });
    });

    Scenario('Verify input element exists', ({ Given }) => {
        Given('the component is rendered with defaults', async () => {
            await harness.renderHarness(TextField);
        });
    });

    Scenario('Verify label-input relationship', ({ Given }) => {
        Given('the "id" property is set to "test"', async () => {
            await harness.renderHarness(TextField, { id: 'test' });
        });
        // And "label" is set via shared step (setProps)
    });
});
