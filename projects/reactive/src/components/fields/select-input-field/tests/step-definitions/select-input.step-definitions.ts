/* eslint-disable no-undef */
import baseAttributeDefinitions from './base.step-definitions.js';
import hasAttributeDefinitions from './has-attribute.step-definitions.js';

const stepDefinitions = (stepControls) => {
    const {
        when,
        then,
    } = stepControls;

    const setupStep = (step) => (text, cb) => {
        step(text, async (...args) => {
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
