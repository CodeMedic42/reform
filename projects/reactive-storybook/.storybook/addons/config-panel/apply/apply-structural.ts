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
    let resolved = fromDir ? `${fromDir}/${cleanUrl}` : cleanUrl;

    // Normalize .. segments
    const parts = resolved.split('/');
    const normalized: string[] = [];
    for (const part of parts) {
        if (part === '..') {
            normalized.pop();
        } else if (part !== '.') {
            normalized.push(part);
        }
    }
    return normalized.join('/');
}

function findSource(sources: Record<string, string>, basePath: string): { key: string; content: string } | null {
    // Normalize path - remove any double slashes and leading slashes
    const normalized = basePath.replace(/\/+/g, '/').replace(/^\//, '');

    // Build underscore-prefixed partial path
    const lastSlash = normalized.lastIndexOf('/');
    const underscored = lastSlash === -1
        ? `_${normalized}`
        : `${normalized.substring(0, lastSlash + 1)}_${normalized.substring(lastSlash + 1)}`;

    const candidates = [
        normalized,
        `${normalized}.scss`,
        `${underscored}.scss`,
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

/**
 * Insert config variable overrides into a configuration source file.
 * Only injects variables that the file actually defines (has !default for),
 * so forwarded modules don't collide.
 */
function injectConfigIntoSource(source: string, configLines: string[]): string {
    // Find which variable names this file defines with !default
    const defaultVarPattern = /^\$([a-zA-Z0-9_-]+)\s*:/;
    const fileVars = new Set<string>();
    for (const line of source.split('\n')) {
        if (line.includes('!default')) {
            const match = line.match(defaultVarPattern);
            if (match) fileVars.add(match[1]);
        }
    }

    // Filter config lines to only those whose variable is defined in this file
    const relevantLines = configLines.filter((line) => {
        const match = line.match(defaultVarPattern);
        return match && fileVars.has(match[1]);
    });

    if (relevantLines.length === 0) return source;

    const sourceLines = source.split('\n');
    let insertIndex = 0;

    // Find the position after all @use/@forward lines at the top
    for (let i = 0; i < sourceLines.length; i++) {
        const trimmed = sourceLines[i].trim();
        if (trimmed.startsWith('@use ') || trimmed.startsWith('@forward ')) {
            insertIndex = i + 1;
        } else if (trimmed !== '' && !trimmed.startsWith('//')) {
            break;
        }
    }

    sourceLines.splice(insertIndex, 0, '', ...relevantLines, '');
    return sourceLines.join('\n');
}

async function compileScssToCss(config: ConfigState): Promise<string> {
    const sass = await loadSass();
    const sources = await loadScssSources();

    // Generate the config SCSS and extract complete variable assignment statements.
    // Assignments may span multiple lines (e.g. map values), so we track
    // parenthesis depth to capture the full statement.
    const configScss = generateScss(config);
    const allLines = configScss.split('\n');
    const configLines: string[] = [];
    let current: string[] = [];
    let depth = 0;

    for (const line of allLines) {
        if (depth === 0 && !line.startsWith('$')) continue;
        if (depth === 0 && line.startsWith('$')) {
            current = [line];
        } else {
            current.push(line);
        }
        for (const ch of line) {
            if (ch === '(') depth++;
            else if (ch === ')') depth--;
        }
        if (depth === 0 && current.length > 0) {
            configLines.push(current.join('\n'));
            current = [];
        }
    }

    // Build the full SCSS source — config vars are injected into modules, not set as globals
    const fullScss = `@import 'index';`;

    const result = await sass.compileStringAsync(fullScss, {
        url: new URL('file:///virtual/entry.scss'),
        silenceDeprecations: ['import', 'global-builtin'],
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
                    let content = sources[path];

                    // Inject config variables into configuration files so they
                    // override !default values within the module's own scope
                    if (path.startsWith('configuration/')) {
                        content = injectConfigIntoSource(content, configLines);
                    }

                    return { contents: content, syntax: 'scss' as const };
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
        } catch (err) {
            console.error('[Config Panel] SCSS compilation error:', err);
        }
    }, 400);
}
