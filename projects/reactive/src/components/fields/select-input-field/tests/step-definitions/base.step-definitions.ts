/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import { toNumber, map } from 'lodash-es';
import { getInnerText, getClassList } from '@reformjs/web-unit/util';

declare const harnessControl: any;

interface StepControls {
    given: (pattern: RegExp, cb: (...args: any[]) => Promise<void>) => void;
    when: (pattern: RegExp, cb: (...args: any[]) => Promise<void>) => void;
    then: (pattern: RegExp, cb: (...args: any[]) => Promise<void>) => void;
}

const stepDefinitions = (stepControls: StepControls): void => {
    const {
        given,
        when,
        then,
    } = stepControls;

    given(
        /^the "(.*)" property is set to "(.*)"$/,
        async (propId: string, propValue: string) => {
            await harnessControl.setProps({ [propId]: propValue });
        },
    );

    given(/^the "(.*)" property is set to null$/, async (propId: string) => {
        await harnessControl.setProps({ [propId]: null });
    });

    given(/^the "(.*)" property is set to undefined$/, async (propId: string) => {
        await harnessControl.setProps({ [propId]: undefined });
    });

    given(/^the "(.*)" property is set to true$/, async (propId: string) => {
        await harnessControl.setProps({ [propId]: true });
    });

    given(/^the "(.*)" property is set to false$/, async (propId: string) => {
        await harnessControl.setProps({ [propId]: false });
    });

    given(/^the "(.*)" property is set to a string collection of:$/, async (propId: string, items: any[]) => {
        const stringItems = map(items, (item) => item.values);

        await harnessControl.setProps({ [propId]: stringItems });
    });

    given(/^the "(.*)" property is set to a numeric collection of:$/, async (propId: string, items: any[]) => {
        const numericItems = map(items, (item) => toNumber(item.values));

        await harnessControl.setProps({ [propId]: numericItems });
    });

    given(/^the "(.*)" property is set to a collection of:$/, async (propId: string, items: any[]) => {
        await harnessControl.setProps({ [propId]: items });
    });

    when(/^the "(.*)" property is changed to null$/, async (propId: string) => {
        await harnessControl.setProps({ [propId]: null });
    });

    when(/^the "(.*)" property is changed to "(.*)"$/, async (propId: string, propValue: string) => {
        await harnessControl.setProps({ [propId]: propValue });
    });

    when(/^"(.*)" key is pressed (\d+) time\(s\)$/, async (key: string, times: string) => {
        await harnessControl.pressKey(key, toNumber(times));
    });

    when(/^the root element clicked (\d+) time\(s\)$/, async (times: string) => {
        const elements = await harnessControl.getHarnessElements();

        await harnessControl.clickMouse(elements[0], toNumber(times));
    });

    then(/^the "(.*)" element has text "(.*)"$/, async (elementClassName: string, text: string) => {
        const elements = await harnessControl.getHarnessElements();

        const target = await elements[0].$(elementClassName);

        const observedValue = await getInnerText(target);

        expect(observedValue).toContain(text);
    });

    then(/^the "(.*)" element from body has text "(.*)"$/, async (elementClassName: string, text: string) => {
        const elements = await harnessControl.selectFromBody(elementClassName);

        const observedValue = await getInnerText(elements[0]);

        expect(observedValue).toContain(text);
    });

    then(/^the "(.*)" element does not have text "(.*)"$/, async (elementClassName: string, text: string) => {
        const elements = await harnessControl.getHarnessElements();

        const target = await elements[0].$(elementClassName);

        const observedValue = await getInnerText(target);

        expect(observedValue).not.toContain(text);
    });

    then(/^the "(.*)" element should exist$/, async (selector: string) => {
        const elements = await harnessControl.getHarnessElements();

        const target = await elements[0].$(selector);

        expect(target).toBeTruthy();
    });

    then(/^the "(.*)" element should not exist$/, async (selector: string) => {
        const elements = await harnessControl.getHarnessElements();

        const target = await elements[0].$(selector);

        expect(target).toBeFalsy();
    });

    then(/^the "(.*)" element from body has element "(.*)"$/, async (elementSelector: string, targetSelector: string) => {
        const elements = await harnessControl.selectFromBody(elementSelector);

        const target = await elements[0].$(targetSelector);

        expect(target).toBeTruthy();
    });

    then(/^the "(.*)" element from body has class "(.*)"$/, async (elementSelector: string, className: string) => {
        const elements = await harnessControl.selectFromBody(elementSelector);

        const classList = await getClassList(elements[0]);

        expect(classList).toContain(className);
    });

    then(/^the "(.*)" element from body does not have class "(.*)"$/, async (elementSelector: string, className: string) => {
        const elements = await harnessControl.selectFromBody(elementSelector);

        const classList = await getClassList(elements[0]);

        expect(classList).not.toContain(className);
    });
};

export default stepDefinitions;
