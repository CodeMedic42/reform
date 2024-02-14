/* eslint-disable import/no-extraneous-dependencies */
import { loadFeatures, autoBindSteps } from 'jest-cucumber';
import '@reformjs/web-unit-jest';

import stepDefinitions from './step-definitions/select-input.step-definitions';

const features = loadFeatures('src/components/select-input/tests/features/*.feature');

autoBindSteps(features, [stepDefinitions]);
