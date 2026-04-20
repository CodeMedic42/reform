import WebpackDevServer from 'webpack-dev-server';
import Bluebird from 'bluebird';
import getCompiler from './compiler/index.js';
import type RunContext from '../run-context.js';

async function startServer(runContext: RunContext): Promise<WebpackDevServer> {
    const compiler = getCompiler(runContext);

    const devServerOptions: WebpackDevServer.Configuration = {
        allowedHosts: 'all',
        compress: true,
        hot: false,
        historyApiFallback: true,
        host: 'localhost',
        port: 'auto',
    };

    const server = new WebpackDevServer(devServerOptions, compiler);

    await Bluebird.fromCallback((cb: (err?: Error | null) => void) => {
        server.startCallback(cb);
    });

    await Bluebird.fromCallback((cb: (err?: Error | Error[] | null) => void) => {
        (server as any).middleware.waitUntilValid((stats: any) => {
            if (stats.hasErrors()) {
                cb(stats.compilation.getErrors());
            } else {
                cb();
            }
        });
    });

    return server;
}

export default startServer;
