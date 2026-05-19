import React, { PureComponent } from 'react';
import classnames from 'classnames';
import Typography from './typography.js';
import applyForwardRef from '../../../common/apply-forward-ref.js';

export interface OverlineProps {
    className?: string | null;
    children?: React.ReactNode;
}

interface InternalOverlineProps extends OverlineProps {
    forwardRef?: React.Ref<HTMLSpanElement> | null;
}

class Overline extends PureComponent<InternalOverlineProps> {
    render(): React.ReactNode {
        const {
            className = null, children = null, forwardRef = null, ...rest
        } = this.props;

        return (
            <Typography
                ref={forwardRef}
                className={classnames('ra-overline', className)}
                {...rest}
            >
                {children}
            </Typography>
        );
    }
}

export default applyForwardRef(Overline);
