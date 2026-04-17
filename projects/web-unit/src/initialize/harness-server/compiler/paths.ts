import path from 'path';
import findUp from 'find-up';

export const getProjectRoot = (): string => {
    let result: string | undefined;
    try {
        result = result || path.join(findUp.sync('.git', { type: 'directory' })!, '..');
    } catch (e) {
    //
    }
    try {
        result = result || path.join(findUp.sync('.svn', { type: 'directory' })!, '..');
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

export const nodePathsToArray = (nodePath: string): string[] => nodePath
    .split(process.platform === 'win32' ? ';' : ':')
    .filter(Boolean)
    .map((p: string) => path.resolve('./', p));

const relativePattern: RegExp = /^\.{1,2}([/\\]|$)/;
/**
 * Ensures that a path starts with `./` or `../`, or is entirely `.` or `..`
 */
export const normalizeStoryPath = (filename: string): string => {
    if (relativePattern.test(filename)) return filename;

    return `.${path.sep}${filename}`;
};
