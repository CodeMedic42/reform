function buildConfig(tsconfigRootDir) {
    return {
        extends: [
            'eslint:recommended',
            'airbnb',
            'airbnb-typescript/base',
            'prettier',
        ],
        ignorePatterns: ['.eslintrc.*js', 'rollup.config.*js', 'jest.config.*js'],
        parserOptions: {
            parser: '@typescript-eslint/parser',
            ecmaVersion: 'latest',
            project: true,
            tsconfigRootDir,
        },
        plugins: ['jest', 'import'],
        env: {
            'jest/globals': true,
            browser: true,
        },
        rules: {
            'no-tabs': 0,
            indent: 0,
            'import/extensions': 0,
            'react/jsx-filename-extension': [
                1,
                { extensions: ['.jsx', '.tsx'] },
            ],
            '@typescript-eslint/indent': 0,
            'no-dupe-keys': 'error',
            'react/jsx-props-no-spreading': 0,
        },
    };
}

module.exports = buildConfig;
