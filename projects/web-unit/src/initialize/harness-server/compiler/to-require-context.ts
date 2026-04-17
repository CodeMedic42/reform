import globToRegexp from './glob-to-regexp.js';
import type RunContext from '../../run-context.js';

interface StorySpecifier {
    directory: string;
    files: string;
}

interface RequireContextResult {
    path: string;
    recursive: boolean;
    match: RegExp;
}

const toRequireContext = (runContext: RunContext, specifier: StorySpecifier): RequireContextResult => {
    const { directory, files } = specifier;

    // The importPathMatcher is a `./`-prefixed matcher that includes the directory
    // For `require.context()` we want the same thing, relative to directory
    const match: RegExp = globToRegexp(`./${files}`);

    return {
        path: runContext.fromWorkingDir(directory),
        recursive: files.includes('**') || files.split('/').length > 1,
        match,
    };
};

export { toRequireContext };

export const toRequireContextString = (runContext: RunContext, specifier: StorySpecifier): string => {
    const { path: p, recursive: r, match: m } = toRequireContext(runContext, specifier);

    const result: string = `require.context('${p}', ${r}, ${m})`;
    return result;
};
