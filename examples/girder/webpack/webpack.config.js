const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const reduce = require('lodash/reduce');
const portFinder = require('portfinder');

const workspaceRoot = path.resolve(__dirname, '..');
const srcRoot = path.resolve(workspaceRoot, 'src');

const paths = {
    workspaceRoot,
    srcRoot,
	outputPath: path.resolve(workspaceRoot, 'dist'),
	entryPath: path.resolve(srcRoot, 'index.js'),
	templatePath: path.resolve(srcRoot, 'html/index.html'),
    jsFolder: 'js',
}

// const mapAliases = (dependencies, folder) =>
// 	reduce(
// 		dependencies,
// 		(acc, dependency) => ({
// 			[dependency]: path.resolve(`${folder}/${dependency}`),
// 			...acc,
// 		}),
// 		{},
// 	);

module.exports = () =>
	portFinder
		.getPortPromise({
			port: process.env.PORT || 8080,
		})
		.catch(() => '8080')
		.then((port) => {
            return {
                entry: paths.entryPath,
                output: {
                    filename: `${paths.jsFolder}/[name].[hash].js`,
                    path: paths.outputPath,
                    chunkFilename: `${paths.jsFolder}/[name].[chunkhash].js`,
                },
                module: {
                    rules: [
                        {
                            test: /\.(css|scss)$/,
                            use: [
                                'style-loader',
                                {
                                    loader: 'css-loader',
                                    options: {
                                        sourceMap: true,
                                        modules: {
                                            localIdentName: '[local]',
                                            exportLocalsConvention: 'camelCase',
                                        },
                                    },
                                },
                                {
                                    loader: 'sass-loader',
                                    options: {
                                        webpackImporter: false,
                                        sassOptions: {
                                            includePaths: ['node_modules'],
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            test: /\.(js|mjs|jsx|ts|tsx)$/,
                            use: {
                                loader: 'babel-loader',
                                options: {
                                    compact: false,
                                    cacheDirectory: true,
                                    presets: [
                                        "@babel/preset-env",
                                        "@babel/preset-react"
                                    ],
                                }
                            }
                        },
                        {
                            test: /\.m?js/,
                            resolve: {
                                fullySpecified: false
                            }
                        },
                        {
                            test: /\.(png|jpe?g|gif)$/i,
                            use: [
                              {
                                loader: 'file-loader',
                              },
                            ],
                          },
                    ],
                },
                plugins: [
                    // new webpack.ProvidePlugin({
                    //     process: 'process/browser',
                    // }),
                    new webpack.ProgressPlugin(),
                    new HtmlWebpackPlugin({
                        template: paths.templatePath,
                        scriptLoading: 'defer',
                    }),
                ],
                resolve: {
                    modules: ['node_modules', 'src'],
                    extensions: ['*', '.js', '.jsx', '.css', '.scss', '.ts'],
                    // alias: mapAliases(
                    //     [
                    //         'react',
                    //         'react-dom',
                    //         'react-router-dom',
                    //         'history',
                    //     ],
                    //     './node_modules',
                    // ),
                },
                mode: 'development',
                devtool: 'eval-source-map',
                devServer: {
                    static: paths.outputPath,
                    allowedHosts: 'all',
                    compress: true,
                    hot: true,
                    historyApiFallback: true,
                    open: true,
                    host: process.env.HOST || 'localhost',
                    port,
                },
            };
		});






