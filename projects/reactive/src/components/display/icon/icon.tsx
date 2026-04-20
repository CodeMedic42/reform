import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
    SchemeColor,
    getSchemeColorClasses,
} from '../../../common/color-list.js';

interface IconProps {
    className?: string;
    icon: IconProp;
    color?: SchemeColor | null;
    size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | null;
}

class Icon extends PureComponent<IconProps> {
    render(): React.ReactNode {
        const {
            className = '', color = null, size = null, icon, ...rest
        } = this.props;

        if (isNil(icon)) {
            return null;
        }

        const sizeClass = !isNil(size) ? `size-${size}` : size;

        const colorClasses = getSchemeColorClasses({
            color,
        });

        return (
            <FontAwesomeIcon
                className={classnames(
                    className,
                    'ra-icon',
                    sizeClass,
                    colorClasses,
                )}
                icon={icon}
                {...rest}
            />
        );
    }
}

export default Icon;
