/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import Typography from './typography.js';
import applyForwardRef from '../../../common/apply-forward-ref.js';

interface CaptionProps {
    className?: string | null;
    children?: React.ReactNode;
    label: string;
    forwardRef?: React.Ref<unknown> | null;
    [key: string]: unknown;
}

class Caption extends PureComponent<CaptionProps> {
    render(): React.ReactNode {
        const {
            className = null, label, forwardRef = null, children = null, ...rest
        } = this.props;

        const labelValue = !isNil(label) ? (
            <span className="ra-caption-label">
                {label}
                :
                {' '}
            </span>
        ) : null;

        return (
            <Typography
                ref={forwardRef}
                Component="div"
                className={classnames('ra-caption', className)}
                {...rest}
            >
                {labelValue}
                <span className="ra-caption-body">{children}</span>
            </Typography>
        );
    }
}

export default applyForwardRef(Caption);
