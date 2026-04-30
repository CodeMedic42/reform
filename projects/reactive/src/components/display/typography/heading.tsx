import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import Typography from './typography.js';
import applyForwardRef from '../../../common/apply-forward-ref.js';

export interface HeadingProps {
    className?: string | null;
    children?: React.ReactNode;
    level: number;
    forwardRef?: React.Ref<unknown> | null;
    responsive?: boolean;
}

class Heading extends PureComponent<HeadingProps> {
    render(): React.ReactNode {
        const {
            level, className = null, children = null, forwardRef = null, responsive = false, ...rest
        } = this.props;

        if (isNil(level)) {
            throw new Error('Heading requires a valid level to be specified.');
        }

        const Component = level <= 6 ? `h${level}` : 'div';

        return (
            <Typography
                ref={forwardRef}
                Component={Component}
                className={classnames(
                    'ra-heading',
                    className,
                    `level-${level}`,
                    { responsive },
                )}
                role="heading"
                aria-level={level}
                {...rest}
            >
                {children}
            </Typography>
        );
    }
}

export default applyForwardRef(Heading);
