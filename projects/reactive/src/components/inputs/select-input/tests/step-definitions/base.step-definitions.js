/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import toNumber from 'lodash/toNumber';
import map from 'lodash/map';
import { getInnerText, getClassList } from '@reformjs/web-unit/util';

const stepDefinitions = (stepControls) => {
    const {
        given,
        when,
        then,
    } = stepControls;

    given(
        /^the "(.*)" property is set to "(.*)"$/,
        async (propId, propValue) => {
            await harnessControl.setProps({ [propId]: propValue });
        },
    );

    given(/^the "(.*)" property is set to null$/, async (propId) => {
        await harnessControl.setProps({ [propId]: null });
    });

    given(/^the "(.*)" property is set to undefined$/, async (propId) => {
        await harnessControl.setProps({ [propId]: undefined });
    });

    given(/^the "(.*)" property is set to true$/, async (propId) => {
        await harnessControl.setProps({ [propId]: true });
    });

    given(/^the "(.*)" property is set to false$/, async (propId) => {
        await harnessControl.setProps({ [propId]: false });
    });

    given(/^the "(.*)" property is set to a string collection of:$/, async (propId, items) => {
        const stringItems = map(items, (item) => item.values);

        await harnessControl.setProps({ [propId]: stringItems });
    });

    given(/^the "(.*)" property is set to a numeric collection of:$/, async (propId, items) => {
        const numericItems = map(items, (item) => toNumber(item.values));

        await harnessControl.setProps({ [propId]: numericItems });
    });

    given(/^the "(.*)" property is set to a collection of:$/, async (propId, items) => {
        await harnessControl.setProps({ [propId]: items });
    });

    when(/^the "(.*)" property is changed to null$/, async (propId) => {
        await harnessControl.setProps({ [propId]: null });
    });

    when(/^the "(.*)" property is changed to "(.*)"$/, async (propId, propValue) => {
        await harnessControl.setProps({ [propId]: propValue });
    });

    when(/^"(.*)" key is pressed (\d+) time\(s\)$/, async (key, times) => {
        await harnessControl.pressKey(key, toNumber(times));
    });

    when(/^the root element clicked (\d+) time\(s\)$/, async (times) => {
        const elements = await harnessControl.getHarnessElements();

        await harnessControl.clickMouse(elements[0], toNumber(times));
    });

    then(/^the "(.*)" element has text "(.*)"$/, async (elementClassName, text) => {
        const elements = await harnessControl.getHarnessElements();

        const target = await elements[0].$(elementClassName);

        const observedValue = await getInnerText(target);

        expect(observedValue).toContain(text);
    });

    then(/^the "(.*)" element from body has text "(.*)"$/, async (elementClassName, text) => {
        const elements = await harnessControl.selectFromBody(elementClassName);

        const observedValue = await getInnerText(elements[0]);

        expect(observedValue).toContain(text);
    });

    then(/^the "(.*)" element does not have text "(.*)"$/, async (elementClassName, text) => {
        const elements = await harnessControl.getHarnessElements();

        const target = await elements[0].$(elementClassName);

        const observedValue = await getInnerText(target);

        expect(observedValue).not.toContain(text);
    });

    then(/^the "(.*)" element should exist$/, async (selector) => {
        const elements = await harnessControl.getHarnessElements();

        const target = await elements[0].$(selector);

        expect(target).toBeTruthy();
    });

    then(/^the "(.*)" element should not exist$/, async (selector) => {
        const elements = await harnessControl.getHarnessElements();

        const target = await elements[0].$(selector);

        expect(target).toBeFalsy();
    });

    then(/^the "(.*)" element from body has element "(.*)"$/, async (elementSelector, targetSelector) => {
        const elements = await harnessControl.selectFromBody(elementSelector);

        const target = await elements[0].$(targetSelector);

        expect(target).toBeTruthy();
    });

    then(/^the "(.*)" element from body has class "(.*)"$/, async (elementSelector, className) => {
        const elements = await harnessControl.selectFromBody(elementSelector);

        const classList = await getClassList(elements[0]);

        expect(classList).toContain(className);
    });

    then(/^the "(.*)" element from body does not have class "(.*)"$/, async (elementSelector, className) => {
        const elements = await harnessControl.selectFromBody(elementSelector);

        const classList = await getClassList(elements[0]);

        expect(classList).not.toContain(className);
    });
};

export default stepDefinitions;
