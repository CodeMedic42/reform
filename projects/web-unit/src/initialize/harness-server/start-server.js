const WebpackDevServer = require('webpack-dev-server');
const Promise = require('bluebird');
const getCompiler = require('./compiler');

async function startServer(runContext) {
    const compiler = getCompiler(runContext);

    const devServerOptions = {
        allowedHosts: 'all',
        compress: true,
        hot: false,
        historyApiFallback: true,
        host: 'localhost',
        port: 'auto',
    };

    const server = new WebpackDevServer(devServerOptions, compiler);

    await Promise.fromCallback((cb) => {
        server.startCallback(cb);
    });

    await Promise.fromCallback((cb) => {
        server.middleware.waitUntilValid((stats) => {
            if (stats.hasErrors()) {
                cb(stats.compilation.getErrors());
            } else {
                cb();
            }
        });
    });

    return server;
}

module.exports = startServer;
