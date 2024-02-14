/* eslint-disable no-undef */
import { isNil } from 'lodash';
import SelectInput from './components/inputs/select-input/index';
import Layout from './components/arrangement/layout/index';

const exported = {
    SelectInput,
    Layout,
};

if (!isNil(window)) {
    window.Reactive = exported;
}

export default exported;
