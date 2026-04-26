import type { ConfigState } from '../types';
import { generateScss } from '../export/generate-scss';

const STRUCTURAL_STYLE_ID = 'ra-config-structural';

let compileTimeout: ReturnType<typeof setTimeout> | null = null;
let sassModule: any = null;
let scssSourcesMap: Record<string, string> | null = null;

async function loadSass() {
    if (!sassModule) {
        // @ts-expect-error aliased to sass browser build in webpack config
        sassModule = await import('sass-browser');
    }
    return sassModule;
}

async function loadScssSources(): Promise<Record<string, string>> {
    if (!scssSourcesMap) {
        const sources = await import('../compiler/sources');
        scssSourcesMap = sources.scssSourceMap;
    }
    return scssSourcesMap;
}

function resolvePath(fromDir: string, importUrl: string): string {
    // Remove leading ./
    const cleanUrl = importUrl.replace(/^\.\//, '');

    // If the import is from a subdirectory, resolve relative to it
    if (fromDir) {
        return `${fromDir}/${cleanUrl}`;
    }
    return cleanUrl;
}

function findSource(sources: Record<string, string>, basePath: string): { key: string; content: string } | null {
    // Normalize path - remove any double slashes and leading slashes
    const normalized = basePath.replace(/\/+/g, '/').replace(/^\//, '');

    const candidates = [
        normalized,
        `${normalized}.scss`,
        `${normalized}/index.scss`,
    ];

    for (const candidate of candidates) {
        if (sources[candidate] !== undefined) {
            return { key: candidate, content: sources[candidate] };
        }
    }
    return null;
}

function getDirFromPath(path: string): string {
    const lastSlash = path.lastIndexOf('/');
    if (lastSlash === -1) return '';
    return path.substring(0, lastSlash);
}

async function compileScssToCss(config: ConfigState): Promise<string> {
    const sass = await loadSass();
    const sources = await loadScssSources();

    // Generate the config SCSS (without the @import at the end)
    const configScss = generateScss(config);
    const lines = configScss.split('\n');
    const configLines = lines.filter((line) => !line.startsWith("@import"));
    const configOnly = configLines.join('\n');

    // Build the full SCSS source with the library entry point
    const fullScss = `@use 'sass:math';\n@use "sass:map";\n${configOnly}\n@import 'index';`;

    const result = await sass.compileStringAsync(fullScss, {
        url: new URL('file:///virtual/entry.scss'),
        importers: [{
            canonicalize(url: string, context: { containingUrl?: URL | null }) {
                // Handle built-in sass modules
                if (url.startsWith('sass:')) return null;

                // Determine the directory of the importing file
                let fromDir = '';
                if (context.containingUrl) {
                    const containingPath = context.containingUrl.pathname.replace('/virtual/', '');
                    fromDir = getDirFromPath(containingPath);
                }

                // Resolve the import path relative to the containing file
                const resolvedPath = resolvePath(fromDir, url);
                const found = findSource(sources, resolvedPath);

                if (found) {
                    return new URL(`file:///virtual/${found.key}`);
                }

                // Also try from root if relative resolution failed
                if (fromDir) {
                    const rootFound = findSource(sources, url);
                    if (rootFound) {
                        return new URL(`file:///virtual/${rootFound.key}`);
                    }
                }

                return null;
            },
            load(canonicalUrl: URL) {
                const path = canonicalUrl.pathname.replace('/virtual/', '');
                if (sources[path] !== undefined) {
                    return { contents: sources[path], syntax: 'scss' as const };
                }
                return null;
            },
        }],
    });

    return result.css;
}

export function applyStructural(config: ConfigState): void {
    if (compileTimeout) {
        clearTimeout(compileTimeout);
    }

    compileTimeout = setTimeout(async () => {
        try {
            const css = await compileScssToCss(config);

            let styleEl = document.getElementById(STRUCTURAL_STYLE_ID) as HTMLStyleElement | null;
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = STRUCTURAL_STYLE_ID;
                document.head.appendChild(styleEl);
            }
            styleEl.textContent = css;

            // Disable the original library stylesheet to avoid conflicts
            const originalStyles = document.querySelectorAll('style');
            originalStyles.forEach((el) => {
                if (el.id !== STRUCTURAL_STYLE_ID &&
                    el.id !== 'ra-config-colors' &&
                    el.textContent?.includes('.ra-spinner')) {
                    (el as any).disabled = true;
                }
            });
        } catch (err) {
            console.error('[Config Panel] SCSS compilation error:', err);
        }
    }, 400);
}
