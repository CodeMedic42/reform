import { defineConfig } from 'rollup';
import path from 'path';
import fs from 'fs';
import { get, isNil } from 'lodash-es';
import pluginTs from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';
import nodeExternals from 'rollup-plugin-node-externals';
import assetResolver from './plugin-asset-resolver.mjs';

const packageJsonPath = path.join(process.cwd(), 'package.json');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

let input = ['src/index.ts', 'src/index.tsx', 'src/index.js', 'src/index.jsx']
    .map(f => path.join(process.cwd(), f))
    .find(f => fs.existsSync(f)) || path.join(process.cwd(), 'src/index.ts');

function resolveInputs(extensions) {
    if (isNil(packageJson.exports)) return null;

    const result = Object.values(packageJson.exports).reduce((acc, chunk) => {
        const importVal = chunk.import;

        if (!isNil(importVal) && importVal.endsWith('.mjs')) {
            const basePath = importVal
                .replace("/dist/", "/src/")
                .replace(".mjs", "");

            let source = null;

            for (const ext of extensions) {
                const candidate = basePath + ext;
                if (fs.existsSync(path.join(process.cwd(), candidate))) {
                    source = candidate;
                    break;
                }
            }

            if (!isNil(source)) {
                const entry = source.replace(/\.\/src\/|\.tsx?|\.jsx?/g, "");
                acc[entry] = source;
            }
        }

        return acc;
    }, {});

    return Object.keys(result).length > 0 ? result : null;
}

const allExtensions = ['.ts', '.tsx', '.js', '.jsx'];
const tsExtensions = ['.ts', '.tsx'];

input = resolveInputs(allExtensions) || input;
const dtsInput = resolveInputs(tsExtensions) || resolveInputs(allExtensions) || input;

function tsExtensionResolver() {
    return {
        name: 'ts-extension-resolver',
        resolveId(source, importer) {
            if (!importer || !source.startsWith('.')) return null;
            if (!source.endsWith('.js')) return null;

            const dir = path.dirname(importer);
            const base = source.slice(0, -3);
            const extensions = ['.ts', '.tsx', '.js', '.jsx'];

            for (const ext of extensions) {
                const candidate = path.resolve(dir, base + ext);
                if (fs.existsSync(candidate)) {
                    return candidate;
                }
            }

            return null;
        }
    };
}

export default function buildConfig() {
    return defineConfig([
        {
            input,
            output: [
                {
                    dir: 'dist',
                    format: 'es',
                    entryFileNames: '[name].mjs',
                    preserveModules: true,
                },
            ],
            plugins: [
                nodeExternals(),
                tsExtensionResolver(),
                assetResolver({ include: ['.png$'] }),
                pluginTs({
                    ...(fs.existsSync(path.join(process.cwd(), 'tsconfig.build.json'))
                        ? { tsconfig: 'tsconfig.build.json' }
                        : {}
                    ),
                    include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.js', 'src/**/*.jsx'],
                }),
            ],
        },
        {
            input: dtsInput,
            output: [
                {
                    dir: 'dist',
                    format: 'es',
                },
            ],
            plugins: [
                nodeExternals(),
                tsExtensionResolver(),
                dts({ respectExternal: true }),
            ],
            onwarn(warning, warn) {
                if (warning.code === 'UNRESOLVED_IMPORT') return;
                warn(warning);
            },
        },
    ]);
}
