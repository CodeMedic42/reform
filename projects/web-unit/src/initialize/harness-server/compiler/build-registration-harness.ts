// const path = require('path');
// const fs = require('fs');
import { normalizeStories } from './normalize-stories.js';
import { toRequireContextString } from './to-require-context.js';
import type RunContext from '../../run-context.js';

interface NormalizedStory {
    directory: string;
    files: string;
    titlePrefix: string;
    constPathMatcher: RegExp;
}

function buildRegistrationHarness(runContext: RunContext): string {
    // const registrationHarnessTemplatePath = path.resolve(
    //     __dirname,
    //     'harness-registration-template.js',
    // );

    // const registrationHarnessTemplate = fs.readFileSync(
    //     registrationHarnessTemplatePath,
    //     { encoding: 'utf8' },
    // );

    const harnessesPath: string[] = runContext.getConfig().harnesses;

    const stories: NormalizedStory[] = normalizeStories(harnessesPath, {
        configDir: runContext.fromConfigDir(),
        workingDir: runContext.fromWorkingDir(),
    });

    const injection: string = stories.map((story: NormalizedStory) => toRequireContextString(runContext, story)).join(',');

    return injection;
}

export default buildRegistrationHarness;
