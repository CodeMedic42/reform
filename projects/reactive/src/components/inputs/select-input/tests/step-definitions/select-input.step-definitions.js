/* eslint-disable no-undef */
import baseAttributeDefinitions from './base.step-definitions';
import hasAttributeDefinitions from './has-attribute.step-definitions';

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
