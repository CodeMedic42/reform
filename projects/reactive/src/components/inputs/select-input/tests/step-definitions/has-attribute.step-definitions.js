/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */
import { getElementAttribute } from '@reformjs/web-unit/util';
import isString from 'lodash/isString';

function stepDefinitions({
    then,
    // testControlRef,
}) {
    /* #region From Body */
    /* #region Positive */
    then(
        /^the "(.*)" element from body has attribute "(.*)" which is "(.*)"$/,
        async (elementSelector, propId, propValue) => {
            const elements = await harnessControl.selectFromBody(elementSelector);

            const observedValue = await getElementAttribute(elements[0], propId);

            expect(observedValue).toBe(propValue);
        },
    );

    then(
        /^the "(.*)" element from body has attribute "(.*)" which contains "(.*)"$/,
        async (elementSelector, propId, propValue) => {
            const elements = await harnessControl.selectFromBody(elementSelector);

            const observedValue = await getElementAttribute(elements[0], propId);

            expect(observedValue).toContain(propValue);
        },
    );

    /* #endregion */
    /* #region Negative */
    then(
        /^the "(.*)" element from body has attribute "(.*)" which is not "(.*)"$/,
        async (elementSelector, propId, propValue) => {
            const elements = await harnessControl.selectFromBody(elementSelector);

            const observedValue = await getElementAttribute(elements[0], propId);

            expect(observedValue).not.toBe(propValue);
        },
    );

    then(
        /^the "(.*)" element from body has attribute "(.*)" which does not contain "(.*)"$/,
        async (elementSelector, propId, propValue) => {
            const elements = await harnessControl.selectFromBody(elementSelector);

            const observedValue = await getElementAttribute(elements[0], propId);

            expect(observedValue).not.toContain(propValue);
        },
    );

    /* #endregion */
    /* #endregion */
    /* #region Root Element */
    /* #region Positive */
    then(/^the root element has attribute "(.*)" which is "(.*)"$/, async (propId, propValue) => {
        const elements = await harnessControl.getHarnessElements();

        const observedValue = await getElementAttribute(elements[0], propId);

        expect(observedValue).toBe(propValue);
    });

    then(/^the root element has attribute "(.*)" which contains "(.*)"$/, async (propId, propValue) => {
        const elements = await harnessControl.getHarnessElements();

        const observedValue = await getElementAttribute(elements[0], propId);

        expect(observedValue).toContain(propValue);
    });

    then(/^the root element has attribute "(.*)" which has a value$/, async (propId) => {
        const elements = await harnessControl.getHarnessElements();

        const observedValue = await getElementAttribute(elements[0], propId);

        expect(isString(observedValue) && observedValue.length > 0).toBeTruthy();
    });

    /* #region Negative */
    then(/^the root element has attribute "(.*)" which does not contain "(.*)"$/, async (propId, propValue) => {
        const elements = await harnessControl.getHarnessElements();

        const observedValue = await getElementAttribute(elements[0], propId);

        expect(observedValue).not.toContain(propValue);
    });

    /* #endregion */
    /* #endregion */
    /* #endregion */
    /* #region Sub Element */
    /* #region Positive */
    then(/^the "(.*)" element has attribute "(.*)" which is "(.*)"$/, async (elementSelector, propId, propValue) => {
        const elements = await harnessControl.getHarnessElements();

        const target = await elements[0].$(elementSelector);

        const observedValue = await getElementAttribute(target, propId);

        expect(observedValue).toBe(propValue);
    });

    then(/^the "(.*)" element has attribute "(.*)" which contains "(.*)"$/, async (elementSelector, propId, propValue) => {
        const elements = await harnessControl.getHarnessElements();

        const target = await elements[0].$(elementSelector);

        const observedValue = await getElementAttribute(target, propId);

        expect(observedValue).toContain(propValue);
    });

    /* #endregion */
    /* #region Negative */
    then(
        /^the "(.*)" element has attribute "(.*)" which does not contain "(.*)"$/,
        async (elementSelector, propId, propValue) => {
            const elements = await harnessControl.getHarnessElements();

            const target = await elements[0].$(elementSelector);

            const observedValue = await getElementAttribute(target, propId);

            expect(observedValue).not.toContain(propValue);
        },
    );

    /* #endregion */
    /* #endregion */
}

export default stepDefinitions;
