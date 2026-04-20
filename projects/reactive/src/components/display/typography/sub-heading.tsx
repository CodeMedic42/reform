import React, { PureComponent } from 'react';
import classnames from 'classnames';
import Typography from './typography.js';
import applyForwardRef from '../../../common/apply-forward-ref.js';

interface SubHeadingProps {
    className?: string | null;
    children?: React.ReactNode;
    level: '1' | '2' | '3' | '4' | '5';
    forwardRef?: React.Ref<unknown> | null;
    weightNormal?: boolean;
    responsive?: boolean;
}

class SubHeading extends PureComponent<SubHeadingProps> {
    render(): React.ReactNode {
        const {
            className = null,
            children = null,
            level,
            weightNormal = false,
            forwardRef = null,
            responsive = false,
            ...rest
        } = this.props;

        return (
            <Typography
                ref={forwardRef}
                Component="div"
                className={classnames(
                    'ra-sub-heading',
                    className,
                    `level-${level}`,
                    {
                        'weight-normal': weightNormal,
                        responsive,
                    },
                )}
                {...rest}
            >
                {children}
            </Typography>
        );
    }
}

export default applyForwardRef(SubHeading);
