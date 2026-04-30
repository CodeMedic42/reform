import React, { memo } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import Typography from './typography.js';
import applyForwardRef from '../../../common/apply-forward-ref.js';

export interface ParagraphProps {
    className?: string | null;
    children?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | null;
    weight?: 'bold' | 'semi-bold' | 'normal' | null;
    forwardRef?: React.Ref<unknown> | null;
}

function Paragraph(props: ParagraphProps): React.ReactNode {
    const {
        className = null, size = null, weight = null, forwardRef = null, children = null, ...rest
    } = props;

    const weightClass = !isNil(weight) ? `weight-${weight}` : null;
    const sizeClass = !isNil(size) ? `size-${size}` : null;

    return (
        <Typography
            ref={forwardRef}
            Component="p"
            className={classnames(
                'ra-paragraph',
                sizeClass,
                className,
                weightClass,
            )}
            {...rest}
        >
            {children}
        </Typography>
    );
}

export default applyForwardRef(memo(Paragraph));
