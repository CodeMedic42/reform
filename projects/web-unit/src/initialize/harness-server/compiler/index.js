const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const buildRegistrationHarness = require('./build-registration-harness');

const mapAliases = (dependencies, folder) => dependencies.reduce(
    (acc, dependency) => ({
        [dependency]: path.resolve(`${folder}/${dependency}`),
        ...acc,
    }),
    {},
);

function getCompiler(runContext) {
    const registrationHarness = buildRegistrationHarness(runContext);

    const config = {
        stats: 'none',
        infrastructureLogging: {
            level: 'none',
        },
        mode: 'development',
        entry: [
            runContext.fromClientDir('index.js'),
            runContext.fromConfigDir('script.js'),
        ],
        output: {
            filename: '[name].js',
            chunkFilename: '[name].js',
            publicPath: '/',
        },
        devtool: 'eval-source-map',
        target: 'web',
        module: {
            rules: [
                {
                    test: /\.(tsx?|jsx?)$/,
                    use: [
                        // {
                        // loader: require.resolve('@jsdevtools/coverage-istanbul-loader'),
                        // },
                        {
                            loader: require.resolve('babel-loader'),
                            options: {
                                sourceType: 'unambiguous',
                                presets: [
                                    require.resolve('@babel/preset-env'),
                                    require.resolve('@babel/preset-react'),
                                    [require.resolve('@babel/preset-typescript'), { allowDeclareFields: true }],
                                ],
                                babelrc: false,
                                configFile: false,
                            },
                        },
                    ],
                    include: [runContext.fromWorkingDir()],
                    exclude: [/node_modules/, /dist/],
                },
                {
                    test: /harness-registration\.js$/,
                    loader: require.resolve('string-replace-loader'),
                    options: {
                        // search: '$',
                        // replace: 'window.jQuery',
                        search: "'__WEB_UNIT_HARNESS_RESOLUTION__'",
                        replace: registrationHarness,
                        flags: 'g',
                    },
                },
                {
                    test: /\.(css|scss)$/,
                    use: [
                        require.resolve('style-loader'),
                        {
                            loader: require.resolve('css-loader'),
                            options: {
                                sourceMap: true,
                                modules: {
                                    localIdentName: '[local]',
                                    exportLocalsConvention: 'camelCase',
                                },
                            },
                        },
                        require.resolve('sass-loader'),
                    ],
                },
            ],
        },
        resolve: {
            extensions: ['.mjs', '.js', '.jsx', '.json', '.cjs', '.ts', '.tsx'],
            alias: mapAliases(
                [
                    'react',
                    'react-dom',
                ],
                './node_modules',
            ),
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: runContext.fromClientDir('template.html'),
                scriptLoading: 'defer',
            }),
        ],
    };

    return webpack(config);
}

module.exports = getCompiler;
