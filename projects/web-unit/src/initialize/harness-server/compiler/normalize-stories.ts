import fs from 'fs';
import path from 'path';
// const dedent = require('ts-dedent');
import { scan } from 'picomatch';
import slash from 'slash';
import { normalizeStoryPath } from './paths.js';
import globToRegexp from './glob-to-regexp.js';

const DEFAULT_TITLE_PREFIX: string = '';
const DEFAULT_FILES: string = '**/*.stories.@(mdx|tsx|ts|jsx|js)';

interface StorySpecifier {
    titlePrefix: string;
    directory: string;
    files: string;
}

interface NormalizedStorySpecifier extends StorySpecifier {
    constPathMatcher: RegExp;
}

interface DirectoryOptions {
    configDir: string;
    workingDir: string;
}

interface DirectoryFromWorkingDirParams {
    configDir: string;
    workingDir: string;
    directory: string;
}

const detectBadGlob = (val: string): string => {
    // const match = val.match(/\.(\([^)]+\))/);

    // if (match) {
    //     return fixBadGlob(match);
    // }

    return val;
};

const isDirectory = (configDir: string, entry: string): boolean => {
    try {
        return fs.lstatSync(path.resolve(configDir, entry)).isDirectory();
    } catch (err) {
        return false;
    }
};

export const getDirectoryFromWorkingDir = ({
    configDir,
    workingDir,
    directory,
}: DirectoryFromWorkingDirParams): string => {
    const directoryFromConfig: string = path.resolve(configDir, directory);
    const directoryFromWorking: string = path.relative(workingDir, directoryFromConfig);

    // relative('/foo', '/foo/src') => 'src'
    // but we want `./src` to match constPaths
    return normalizeStoryPath(directoryFromWorking);
};

export const normalizeStoriesEntry = (
    entry: string | Partial<StorySpecifier>,
    { configDir, workingDir }: DirectoryOptions,
): NormalizedStorySpecifier => {
    let specifierWithoutMatcher: StorySpecifier;

    if (typeof entry === 'string') {
        const fixedEntry: string = detectBadGlob(entry);
        const globResult = scan(fixedEntry);
        if (globResult.isGlob) {
            const directory: string = globResult.prefix + globResult.base;
            const files: string = globResult.glob;

            specifierWithoutMatcher = {
                titlePrefix: DEFAULT_TITLE_PREFIX,
                directory,
                files,
            };
        } else if (isDirectory(configDir, entry)) {
            specifierWithoutMatcher = {
                titlePrefix: DEFAULT_TITLE_PREFIX,
                directory: entry,
                files: DEFAULT_FILES,
            };
        } else {
            specifierWithoutMatcher = {
                titlePrefix: DEFAULT_TITLE_PREFIX,
                directory: path.dirname(entry),
                files: path.basename(entry),
            };
        }
    } else {
        specifierWithoutMatcher = {
            titlePrefix: DEFAULT_TITLE_PREFIX,
            files: DEFAULT_FILES,
            directory: '',
            ...entry,
        };
    }

    // We are going to be doing everything with node constPaths which use
    // URL format, i.e. `/` as a separator, so let's make sure we've normalized
    const files: string = slash(specifierWithoutMatcher.files);

    // At this stage `directory` is relative to `main.js` (the config dir)
    // We want to work relative to the working dir, so we transform it here.
    const { directory: directoryRelativeToConfig } = specifierWithoutMatcher;

    const directory: string = slash(
        getDirectoryFromWorkingDir({
            configDir,
            workingDir,
            directory: directoryRelativeToConfig,
        }),
    ).replace(/\/$/, '');

    // Now make the constFn matcher.
    const constPathMatcher: RegExp = globToRegexp(`${directory}/${files}`);

    return {
        ...specifierWithoutMatcher,
        directory,
        constPathMatcher,
    };
};

export const normalizeStories = (
    entries: (string | Partial<StorySpecifier>)[],
    options: DirectoryOptions,
): NormalizedStorySpecifier[] => entries.map(
    (entry: string | Partial<StorySpecifier>) => normalizeStoriesEntry(entry, options),
);
