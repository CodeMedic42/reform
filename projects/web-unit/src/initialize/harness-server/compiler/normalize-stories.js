const fs = require('fs');
const path = require('path');
// const dedent = require('ts-dedent');
const { scan } = require('picomatch');
const slash = require('slash');
const { normalizeStoryPath } = require('./paths');
const globToRegexp = require('./glob-to-regexp');

const DEFAULT_TITLE_PREFIX = '';
const DEFAULT_FILES = '**/*.stories.@(mdx|tsx|ts|jsx|js)';

// eslint-disable-next-line arrow-body-style
const detectBadGlob = (val) => {
    // const match = val.match(/\.(\([^)]+\))/);

    // if (match) {
    //     return fixBadGlob(match);
    // }

    return val;
};

const isDirectory = (configDir, entry) => {
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
}) => {
    const directoryFromConfig = path.resolve(configDir, directory);
    const directoryFromWorking = path.relative(workingDir, directoryFromConfig);

    // relative('/foo', '/foo/src') => 'src'
    // but we want `./src` to match constPaths
    return normalizeStoryPath(directoryFromWorking);
};

export const normalizeStoriesEntry = (
    entry,
    { configDir, workingDir },
) => {
    let specifierWithoutMatcher;

    if (typeof entry === 'string') {
        const fixedEntry = detectBadGlob(entry);
        const globResult = scan(fixedEntry);
        if (globResult.isGlob) {
            const directory = globResult.prefix + globResult.base;
            const files = globResult.glob;

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
            ...entry,
        };
    }

    // We are going to be doing everything with node constPaths which use
    // URL format, i.e. `/` as a separator, so let's make sure we've normalized
    const files = slash(specifierWithoutMatcher.files);

    // At this stage `directory` is relative to `main.js` (the config dir)
    // We want to work relative to the working dir, so we transform it here.
    const { directory: directoryRelativeToConfig } = specifierWithoutMatcher;

    const directory = slash(
        getDirectoryFromWorkingDir({
            configDir,
            workingDir,
            directory: directoryRelativeToConfig,
        }),
    ).replace(/\/$/, '');

    // Now make the constFn matcher.
    const constPathMatcher = globToRegexp(`${directory}/${files}`);

    return {
        ...specifierWithoutMatcher,
        directory,
        constPathMatcher,
    };
};

module.exports.normalizeStories = (entries, options) => entries.map(
    (entry) => normalizeStoriesEntry(entry, options),
);
