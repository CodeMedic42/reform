const path = require('path');
const findUp = require('find-up');

module.exports.getProjectRoot = () => {
    let result;
    try {
        result = result || path.join(findUp.sync('.git', { type: 'directory' }), '..');
    } catch (e) {
    //
    }
    try {
        result = result || path.join(findUp.sync('.svn', { type: 'directory' }), '..');
    } catch (e) {
    //
    }
    try {
        result = result || __dirname.split('node_modules')[0];
    } catch (e) {
    //
    }

    return result || process.cwd();
};

module.exports.nodePathsToArray = (nodePath) => nodePath
    .split(process.platform === 'win32' ? ';' : ':')
    .filter(Boolean)
    .map((p) => path.resolve('./', p));

const relativePattern = /^\.{1,2}([/\\]|$)/;
/**
 * Ensures that a path starts with `./` or `../`, or is entirely `.` or `..`
 */
module.exports.normalizeStoryPath = (filename) => {
    if (relativePattern.test(filename)) return filename;

    return `.${path.sep}${filename}`;
};
