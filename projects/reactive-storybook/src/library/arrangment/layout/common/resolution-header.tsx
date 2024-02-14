import React, { memo, PropsWithChildren } from 'react';
import classnames from 'classnames';
import hiddenBuilder from '@reformjs/reactive/class-builders/hidden';

export interface Props {
  sticky: boolean;
}

function ResolutionHeader(props: PropsWithChildren<Props>) {
    const { sticky } = props;

    return (
        <div className={classnames('resolution-header', { sticky })}>
            <h1
                className={classnames(
                    'header-text',
                    hiddenBuilder([true, true, true, true, false]),
                )}
            >
                DESKTOP: 2xl
            </h1>
            <h1
                className={classnames(
                    'header-text',
                    hiddenBuilder([true, true, true, false, true]),
                )}
            >
                DESKTOP: XL
            </h1>
            <h1
                className={classnames(
                    'header-text',
                    hiddenBuilder([true, true, false, true, true]),
                )}
            >
                DESKTOP: LG
            </h1>
            <h1
                className={classnames(
                    'header-text',
                    hiddenBuilder([true, false, true, true, true]),
                )}
            >
                TABLET: MD
            </h1>
            <h1
                className={classnames(
                    'header-text',
                    hiddenBuilder([false, true, true, true, true]),
                )}
            >
                MOBILE: SM
            </h1>
        </div>
    );
}

export default memo(ResolutionHeader);
