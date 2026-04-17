import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Icon from '../icon/index.js';
import {
    SchemeColor,
    getSchemeColorClasses,
} from '../../../common/color-list.js';

interface IconBoxProps {
    id?: string;
    className?: string;
    style?: React.CSSProperties | null;
    'aria-label'?: string | null;
    title?: string | null;
    icon: IconProp;
    size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    color?: SchemeColor | null;
    hidden?: boolean;
    alignToIcon?: boolean;
}

class IconBox extends PureComponent<IconBoxProps> {
    render(): React.ReactNode {
        const {
            id = '',
            className = '',
            style = null,
            'aria-label': ariaLabel = null,
            title = null,
            icon,
            size = 'md',
            color = null,
            hidden = false,
            alignToIcon = false,
        } = this.props;

        const sizeClass = !isNil(size) ? `size-${size}` : 'size-md';

        const colorClasses = getSchemeColorClasses({ color });

        return (
            <span
                id={id}
                style={style ?? undefined}
                className={classnames(
                    className,
                    'ra-icon-box',
                    sizeClass,
                    colorClasses,
                    {
                        hidden,
                        'align-to-icon': alignToIcon,
                    },
                )}
                aria-label={ariaLabel ?? undefined}
                title={title ?? undefined}
            >
                <Icon icon={icon} color={color} />
            </span>
        );
    }
}

export default IconBox;
