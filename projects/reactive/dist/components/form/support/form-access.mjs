import { isNil } from 'lodash-es';
import { ApplyFormPropertyConsumer } from './form-context.mjs';
import { useState, useEffect } from 'react';
import { State } from '@reformjs/reactive-data';

function FormAccess(props) {
    const { children, property, data, listenToData, listenToProperty, validateOnBlur, } = props;
    if (isNil(property)) {
        throw new Error('Property not defined');
    }
    const [value, setValue] = useState(property.getValue());
    const [propertyValid, setPropertyValid] = useState(property.isValid());
    const [dataValid, setDataValid] = useState(data.isValid());
    useEffect(() => {
        if (listenToProperty) {
            property.onChange((property) => {
                const value = property.getValue();
                setValue(value);
            });
            property.onStateChange((property, state) => {
                if (property.getState() === State.idle) {
                    setPropertyValid(property.isValid());
                }
            });
        }
        if (listenToData) {
            data.onStateChange((state) => {
                if (state === State.idle) {
                    setDataValid(data.isValid());
                }
            });
        }
        return () => { };
    }, []);
    const validation = property.getRulesStatus();
    return (children({
        property,
        data,
        value,
        valid: {
            property: propertyValid,
            data: dataValid,
        },
        setValue: (newValue) => {
            property.setValue(newValue);
        },
        validation,
        validateOnBlur,
    }) ?? null);
}
var FormAccess$1 = ApplyFormPropertyConsumer(FormAccess);

export { FormAccess$1 as default };
