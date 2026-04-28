import React, { PropsWithChildren } from 'react';
import classnames from 'classnames';
import hiddenBuilder from '@reformjs/reactive/class-builders/hidden';

const STORAGE_KEY = 'ra-config-panel-state';

export interface Props {
  sticky: boolean;
}

function getBreakpoints(): string[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            const config = parsed.config || parsed;
            if (Array.isArray(config?.layout?.breakpoints) && config.layout.breakpoints.length > 0) {
                return config.layout.breakpoints;
            }
        }
    } catch {
        // ignore parse errors
    }
    return [];
}

function ResolutionHeader(props: PropsWithChildren<Props>) {
    const { sticky } = props;
    const breakpoints = getBreakpoints();
    const bandCount = breakpoints.length + 1;

    return (
        <div className={classnames('resolution-header', { sticky })}>
            {Array.from({ length: bandCount }, (_, bandIndex) => {
                const hidden = Array.from({ length: bandCount }, (_, i) => i !== bandIndex);
                const label = bandIndex === 0
                    ? `< ${breakpoints[0]}`
                    : `>= ${breakpoints[bandIndex - 1]}`;
                return (
                    <h1
                        key={bandIndex}
                        className={classnames('header-text', hiddenBuilder(hidden))}
                    >
                        {label}
                    </h1>
                );
            })}
        </div>
    );
}

export default ResolutionHeader;
