import baseAttributeDefinitions from './base.step-definitions.js';
import hasAttributeDefinitions from './has-attribute.step-definitions.js';

declare const harnessControl: any;

interface StepControls {
    given: (pattern: RegExp, cb: (...args: any[]) => Promise<void>) => void;
    when: (pattern: RegExp | string, cb: (...args: any[]) => Promise<void>) => void;
    then: (pattern: RegExp | string, cb: (...args: any[]) => Promise<void>) => void;
}

const stepDefinitions = (stepControls: StepControls): void => {
    const {
        when,
        then,
    } = stepControls;

    const setupStep = (step: (text: RegExp | string, cb: (...args: any[]) => Promise<void>) => void) => (text: RegExp | string, cb: (...args: any[]) => Promise<void>) => {
        step(text, async (...args: any[]) => {
            await harnessControl.renderHarness('SelectInput');

            await cb(...args);
        });
    };

    const testControls = {
        ...stepControls,
        when: setupStep(when),
        then: setupStep(then),
    };

    hasAttributeDefinitions(testControls);
    baseAttributeDefinitions(testControls);
};

export default stepDefinitions;
