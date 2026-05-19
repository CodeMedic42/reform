const { program } = require('commander');
const initialize = require('../initialize/index.js').default;

interface CliOptions {
    harness?: string;
    props?: string;
}

program
    .option('-h, --harness <string>')
    .option('-p, --props <string>');

program.parse();

const options: CliOptions = program.opts();

async function run(): Promise<void> {
    const { start } = await initialize();

    const harnessControl = await start();

    const {
        harness,
        props,
    } = options;

    if (props != null && props.length > 0) {
        await harnessControl.setProps(JSON.parse(props));
    }

    if (harness != null && harness.length > 0) {
        await harnessControl.renderHarness(harness);
    }
}

run();
