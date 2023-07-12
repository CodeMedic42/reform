const globToRegexp = require('./glob-to-regexp');

const toRequireContext = (runContext, specifier) => {
    const { directory, files } = specifier;

    // The importPathMatcher is a `./`-prefixed matcher that includes the directory
    // For `require.context()` we want the same thing, relative to directory
    const match = globToRegexp(`./${files}`);

    return {
        path: runContext.fromWorkingDir(directory),
        recursive: files.includes('**') || files.split('/').length > 1,
        match,
    };
};

module.exports.toRequireContext = toRequireContext;

module.exports.toRequireContextString = (runContext, specifier) => {
    const { path: p, recursive: r, match: m } = toRequireContext(runContext, specifier);

    const result = `require.context('${p}', ${r}, ${m})`;
    return result;
};
