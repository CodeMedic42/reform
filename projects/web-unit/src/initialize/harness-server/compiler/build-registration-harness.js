// const path = require('path');
// const fs = require('fs');
const { normalizeStories } = require('./normalize-stories');
const { toRequireContextString } = require('./to-require-context');

function buildRegistrationHarness(runContext) {
    // const registrationHarnessTemplatePath = path.resolve(
    //     __dirname,
    //     'harness-registration-template.js',
    // );

    // const registrationHarnessTemplate = fs.readFileSync(
    //     registrationHarnessTemplatePath,
    //     { encoding: 'utf8' },
    // );

    const harnessesPath = runContext.getConfig().harnesses;

    const stories = normalizeStories(harnessesPath, {
        configDir: runContext.fromConfigDir(),
        workingDir: runContext.fromWorkingDir(),
    });

    const injection = stories.map((story) => toRequireContextString(runContext, story)).join(',');

    return injection;
}

module.exports = buildRegistrationHarness;
